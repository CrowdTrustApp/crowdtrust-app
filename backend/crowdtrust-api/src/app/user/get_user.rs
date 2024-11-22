use axum::{
    extract::{Path, State},
    response::{IntoResponse, Response},
    Extension, Json,
};
use lib_api::error::api_error::ApiError;
use lib_types::{
    dto::user::get_user_dto::{to_api_response, to_api_response_private},
    shared::user::{RequestUser, UserType},
};
use uuid::Uuid;

use crate::{api_context::ApiContext, app::helpers::not_found_or_internal};

pub async fn get_user(
    Path(id): Path<Uuid>,
    State(context): State<ApiContext>,
    Extension(request_user): Extension<RequestUser>,
) -> Result<Response, ApiError> {
    let user = context
        .repo
        .user
        .get_user_by_id(id)
        .await
        .map_err(not_found_or_internal)?;

    // Return full user object if requester is admin or current user
    if request_user.user_type == UserType::User || request_user.user_type == UserType::Anonymous {
        if let Some(request_user_id) = request_user.user_id {
            if request_user_id == id {
                return Ok(Json(to_api_response_private(user)).into_response());
            }
        }
    } else if request_user.user_type == UserType::Admin || request_user.user_type == UserType::Cron
    {
        return Ok(Json(to_api_response_private(user)).into_response());
    }

    Ok(Json(to_api_response(user)).into_response())
}
