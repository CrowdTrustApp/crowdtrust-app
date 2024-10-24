use axum::extract::State;
use axum::http::StatusCode;
use axum::Json;

use lib_api::auth::generate_jwt::generate_jwt;
use lib_api::auth::types::UserToken;
use lib_api::db::db_error::DbError;
use lib_api::db::password::verify;
use lib_api::error::api_error::ApiError;

use lib_api::error::helpers::check_bad_form;
use lib_api::eth::verify_signature::verify_signature;
use lib_api::util::json_extractor::CtJson;
use lib_types::dto::auth::login_dto::{LoginDto, LoginResponse};
use lib_types::shared::api_error::ApiErrorCode;
use validator::Validate;

use crate::api_context::ApiContext;

fn to_api_response(user_token: UserToken) -> Json<LoginResponse> {
    let auth_token = match user_token.token {
        Some(token) => token,
        None => String::new(),
    };

    Json(LoginResponse { auth_token })
}

fn login_error() -> ApiError {
    ApiError::unauthorized()
        .code(ApiErrorCode::InvalidAuth)
        .message("Login failed".to_string())
}

pub async fn login_user(
    State(context): State<ApiContext>,
    CtJson(dto): CtJson<LoginDto>,
) -> Result<(StatusCode, Json<LoginResponse>), ApiError> {
    check_bad_form(dto.validate())?;

    // Log in with eth_address and signature
    let user = if let Some(eth_address) = &dto.eth_address {
        let user = context
            .repo
            .user
            .find_user_by_eth_address(eth_address.to_string())
            .await
            .map_err(|e| match e {
                DbError::EntityNotFound() => login_error(),
                _ => ApiError::internal_error().message(format!("Internal Error: {}", e)),
            })?;
        // Verify signature
        if let Some(signature) = &dto.eth_address_signature {
            let message = format!("Log in to CrowdTrust with {}", eth_address);
            if !verify_signature(signature.clone(), message, eth_address.clone())? {
                return Err(ApiError::bad_request()
                    .code(ApiErrorCode::InvalidSignature)
                    .message("Failed to verify signature"));
            }
        } else {
            return Err(ApiError::bad_request()
                .code(ApiErrorCode::SignatureRequired)
                .message("Signature required when updating eth_address"));
        }
        user
        // Log in with email and password
    } else if let (Some(email), Some(password)) = (dto.email, dto.password) {
        // Check if user exists and password is valid
        let user = context
            .repo
            .user
            .find_user_by_email(email)
            .await
            .map_err(|e| match e {
                DbError::EntityNotFound() => login_error(),
                _ => ApiError::internal_error().message(format!("Internal Error: {}", e)),
            })?;

        // Return error if login failed
        let verified = verify(password, &user.password_hash).map_err(|_| login_error())?;
        if !verified {
            return Err(login_error());
        }
        user
    } else {
        return Err(ApiError::bad_request()
            .code(ApiErrorCode::InvalidAuth)
            .message("Signature or email/password required"));
    };

    // Generate auth token
    let jwt = generate_jwt(
        user.id,
        user.user_type,
        14400,
        &context.config.app_auth_secret,
    )?;

    // Return response to client
    let response = to_api_response(jwt);

    Ok((StatusCode::CREATED, response))
}
