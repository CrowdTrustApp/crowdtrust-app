use axum::extract::{Path, State};
use axum::http::StatusCode;
use axum::{Extension, Json};
use chrono::Utc;
use lib_api::db::db_error::DbError;
use lib_api::error::api_error::ApiError;

use lib_api::error::helpers::check_bad_form;
use lib_api::util::json_extractor::CtJson;
use lib_types::dto::project::project_view_model::{to_api_response, ProjectViewModel};
use lib_types::dto::project::update_project_dto::UpdateProjectDto;
use lib_types::shared::api_error::ApiErrorCode;
use lib_types::shared::project::ProjectStatus;
use lib_types::shared::user::{RequestUser, UserType};
use uuid::Uuid;
use validator::Validate;

use crate::api_context::ApiContext;

use crate::app::helpers::{str_to_bigdecimal, verify_admin_or_user};
use crate::db::project_repo::ProjectUpdateProps;

pub async fn update_project(
    Path(project_id): Path<Uuid>,
    State(context): State<ApiContext>,
    Extension(request_user): Extension<RequestUser>,
    CtJson(dto): CtJson<UpdateProjectDto>,
) -> Result<(StatusCode, Json<ProjectViewModel>), ApiError> {
    check_bad_form(dto.validate())?;

    // Get project to be updated
    let project_to_be_updated = context
        .repo
        .project
        .get_project_relations_by_id(project_id)
        .await
        .map_err(|_| {
            ApiError::not_found().message(format!("Project with ID {} not found", project_id))
        })?;

    let is_admin = request_user.user_type == UserType::Admin;
    let is_active = matches!(
        project_to_be_updated.status,
        ProjectStatus::Active | ProjectStatus::Complete | ProjectStatus::Denied
    );

    // Verify request
    verify_admin_or_user(&request_user, project_to_be_updated.user_id.to_string())?;

    let funding_goal = if let Some(funding_goal) = dto.funding_goal {
        Some(str_to_bigdecimal(&funding_goal, "funding_goal")?)
    } else {
        None
    };
    if let Some(assets_order) = &dto.assets_order {
        if assets_order.len() != project_to_be_updated.assets.len() {
            return Err(ApiError::bad_request()
                .code(ApiErrorCode::InvalidFormData)
                .message("Assets order length"));
        }
    }
    if let Some(rewards_order) = &dto.rewards_order {
        if rewards_order.len() != project_to_be_updated.rewards.len() {
            return Err(ApiError::bad_request()
                .code(ApiErrorCode::InvalidFormData)
                .message("Rewards order length"));
        }
    }
    if !is_admin {
        // Verify active project name can't change
        if let Some(_) = dto.name {
            if is_active {
                return Err(ApiError::bad_request().code(ApiErrorCode::ProjectActive));
            }
        }
        // Verify active funding goal can't change
        if let Some(_) = funding_goal {
            if is_active {
                return Err(ApiError::bad_request().code(ApiErrorCode::ProjectActive));
            }
        }
        // Verify start_time is after now
        if let Some(start_time) = dto.start_time {
            if is_active || start_time < Utc::now().timestamp() {
                return Err(ApiError::bad_request().code(ApiErrorCode::ProjectStart));
            }
        }
        // Only admin can update status
        if dto.status.is_some() {
            return Err(ApiError::forbidden());
        }
    }

    let props = ProjectUpdateProps {
        name: dto.name,
        description: dto.description,
        blurb: dto.blurb,
        payment_address: dto.payment_address,
        category: dto.category,
        funding_goal,
        start_time: dto.start_time,
        duration: dto.duration,
        total_pledged: None,
        base_currency: None,
        status: dto.status,
        rewards_order: dto.rewards_order,
        assets_order: dto.assets_order,
        blockchain_status: None,
    };

    // Update project
    let project_result = context
        .repo
        .project
        .update_project(project_id, props)
        .await
        .map_err(|e| match e {
            DbError::Unique(_) => ApiError::bad_request().code(ApiErrorCode::ProjectExists),
            _ => ApiError::internal_error().message(format!("Failed to update project: {}", e)),
        })?;

    // Return response
    Ok((StatusCode::OK, Json(to_api_response(project_result))))
}
