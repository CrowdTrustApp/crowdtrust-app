use axum::extract::{Path, State};
use axum::http::StatusCode;
use axum::{Extension, Json};
use lib_api::db::db_error::DbError;
use lib_api::error::api_error::ApiError;

use lib_api::error::helpers::check_bad_form;
use lib_api::util::json_extractor::CtJson;
use lib_types::dto::pledge::pledge_view_model::{to_api_response, PledgeViewModel};
use lib_types::dto::pledge::update_pledge_dto::UpdatePledgeDto;
use lib_types::shared::api_error::ApiErrorCode;
use lib_types::shared::user::RequestUser;
use uuid::Uuid;
use validator::Validate;

use crate::api_context::ApiContext;

use crate::app::helpers::verify_admin_or_user;
use crate::db::pledge_repo::PledgeUpdateProps;

pub async fn update_pledge(
    Path(pledge_id): Path<Uuid>,
    State(context): State<ApiContext>,
    Extension(request_user): Extension<RequestUser>,
    CtJson(dto): CtJson<UpdatePledgeDto>,
) -> Result<(StatusCode, Json<PledgeViewModel>), ApiError> {
    check_bad_form(dto.validate())?;

    // Get pledge to be updated
    let pledge_to_be_updated = context
        .repo
        .pledge
        .get_pledge_by_id(pledge_id)
        .await
        .map_err(|_| {
            ApiError::not_found().message(format!("Pledge with ID {} not found", pledge_id))
        })?;

    // Verify request
    verify_admin_or_user(&request_user, pledge_to_be_updated.user_id.to_string())?;

    let props = PledgeUpdateProps {
        comment: dto.comment,
        blockchain_status: dto.blockchain_status,
        transaction_hash: dto.transaction_hash,
    };

    // Update pledge
    let pledge_result = context
        .repo
        .pledge
        .update_pledge(pledge_id, props)
        .await
        .map_err(|e| match e {
            DbError::Unique(_) => ApiError::bad_request().code(ApiErrorCode::ProjectExists),
            _ => ApiError::internal_error().message(format!("Failed to update pledge: {}", e)),
        })?;

    // Return response
    Ok((StatusCode::OK, Json(to_api_response(pledge_result))))
}
