use axum::extract::{Path, State};
use axum::http::StatusCode;
use axum::{Extension, Json};
use axum_macros::debug_handler;
use chrono::Utc;
use lib_api::error::api_error::ApiError;
use lib_api::error::helpers::check_bad_form;
use lib_api::util::json_extractor::CtJson;
use lib_types::dto::reward::create_reward_dto::{CreateRewardDto, CreateRewardResponse};
use lib_types::entity::reward_entity::RewardEntity;
use lib_types::shared::api_error::ApiErrorCode;
use lib_types::shared::user::RequestUser;
use uuid::Uuid;
use validator::Validate;

use crate::api_context::ApiContext;
use crate::app::helpers::{get_request_user, str_to_bigdecimal, verify_admin_or_user};
use crate::app::project::helpers::verify_project_exist;
use crate::db::reward_repo::RewardCreateProps;

fn to_api_response(result: RewardEntity) -> Json<CreateRewardResponse> {
    return Json(CreateRewardResponse { id: result.id });
}

#[debug_handler]
pub async fn create_reward(
    Path(project_id): Path<Uuid>,
    State(context): State<ApiContext>,
    Extension(request_user): Extension<RequestUser>,
    CtJson(dto): CtJson<CreateRewardDto>,
) -> Result<(StatusCode, Json<CreateRewardResponse>), ApiError> {
    check_bad_form(dto.validate())?;
    let project = verify_project_exist(&context, project_id).await?;

    // Check if the requester is the owner of the reward or an admin
    verify_admin_or_user(&request_user, project.user_id.to_string())?;

    // Verify delivery_time is after now
    if dto.delivery_time < Utc::now().timestamp() {
        return Err(ApiError::bad_request()
            .code(ApiErrorCode::RewardDelivery)
            .message("Delivery time must be after current time"));
    }
    let price = str_to_bigdecimal(&dto.price, "price")?;

    let props = RewardCreateProps {
        project_id,
        name: dto.name,
        description: dto.description,
        price,
        delivery_time: dto.delivery_time,
        backer_limit: dto.backer_limit,
    };

    let reward_id = context
        .repo
        .reward
        .create_reward(props)
        .await
        .map_err(|e| match e {
            _ => ApiError::internal_error().message(format!("Failed to create reward: {}", e)),
        })?;

    Ok((
        StatusCode::CREATED,
        Json(CreateRewardResponse { id: reward_id }),
    ))
}
