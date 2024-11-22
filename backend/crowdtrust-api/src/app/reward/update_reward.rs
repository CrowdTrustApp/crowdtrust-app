use axum::extract::{Path, State};
use axum::http::StatusCode;
use axum::Extension;
use chrono::Utc;
use lib_api::error::api_error::ApiError;

use lib_api::error::helpers::check_bad_form;
use lib_api::util::json_extractor::CtJson;
use lib_types::dto::reward::update_reward_dto::UpdateRewardDto;
use lib_types::shared::api_error::ApiErrorCode;
use lib_types::shared::project::ProjectStatus;
use lib_types::shared::user::{RequestUser, UserType};
use uuid::Uuid;
use validator::Validate;

use crate::api_context::ApiContext;

use crate::app::helpers::{str_to_bigdecimal, verify_admin_or_user};
use crate::app::project::helpers::verify_project_exist;
use crate::db::reward_repo::RewardUpdateProps;

pub async fn update_reward(
    Path(reward_id): Path<Uuid>,
    State(context): State<ApiContext>,
    Extension(request_user): Extension<RequestUser>,
    CtJson(dto): CtJson<UpdateRewardDto>,
) -> Result<(StatusCode, ()), ApiError> {
    check_bad_form(dto.validate())?;

    // Get reward to be updated
    let reward_to_be_updated = context
        .repo
        .reward
        .get_reward_by_id(reward_id)
        .await
        .map_err(|_| {
            ApiError::not_found().message(format!("Reward with ID {} not found", reward_id))
        })?;
    let project_id = reward_to_be_updated.project_id;
    let project = verify_project_exist(&context, project_id).await?;

    let is_admin = request_user.user_type == UserType::Admin;
    let is_active = matches!(
        project.status,
        ProjectStatus::Active | ProjectStatus::Complete | ProjectStatus::Denied
    );

    // Verify request
    verify_admin_or_user(&request_user, project.user_id.to_string())?;

    let price = if let Some(price) = dto.price {
        Some(str_to_bigdecimal(&price, "price")?)
    } else {
        None
    };
    if !is_admin {
        // Verify active reward name can't change
        if let Some(_) = dto.name {
            if is_active {
                return Err(ApiError::bad_request().code(ApiErrorCode::ProjectActive));
            }
        }
        // Verify active reward description can't change
        if let Some(_) = dto.description {
            if is_active {
                return Err(ApiError::bad_request().code(ApiErrorCode::ProjectActive));
            }
        }
        // Verify active reward price can't change
        if let Some(_) = price {
            if is_active {
                return Err(ApiError::bad_request().code(ApiErrorCode::ProjectActive));
            }
        }
        // Verify delivery_time is after now
        if let Some(delivery_time) = dto.delivery_time {
            if is_active {
                return Err(ApiError::bad_request().code(ApiErrorCode::ProjectActive));
            } else if delivery_time < Utc::now().timestamp() {
                return Err(ApiError::bad_request().code(ApiErrorCode::RewardDelivery));
            }
        }
    }

    let props = RewardUpdateProps {
        name: dto.name,
        description: dto.description,
        price,
        delivery_time: dto.delivery_time,
        backer_count: None,
        backer_limit: dto.backer_limit,
        visible: dto.visible,
    };

    // Update reward
    context
        .repo
        .reward
        .update_reward(reward_id, props)
        .await
        .map_err(|e| match e {
            _ => ApiError::internal_error().message(format!("Failed to update reward: {}", e)),
        })?;

    // Return response
    Ok((StatusCode::OK, ()))
}
