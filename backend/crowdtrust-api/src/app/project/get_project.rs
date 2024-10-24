use axum::{
    extract::{Path, State},
    Extension, Json,
};
use lib_api::error::api_error::ApiError;
use lib_types::{
    dto::project::get_project_dto::{to_api_response, GetProjectResponse},
    shared::{
        project::ProjectStatus,
        user::{RequestUser, UserType},
    },
};
use uuid::Uuid;

use crate::{api_context::ApiContext, app::helpers::not_found_or_internal};

pub async fn get_project(
    Path(id): Path<Uuid>,
    State(context): State<ApiContext>,
    Extension(request_user): Extension<RequestUser>,
) -> Result<Json<GetProjectResponse>, ApiError> {
    // Get project from DB
    let project = context
        .repo
        .project
        .get_project_relations_by_id(id)
        .await
        .map_err(not_found_or_internal)?;

    // Verify user or admin, if the project is not published
    let visible = matches!(
        project.status,
        ProjectStatus::Active | ProjectStatus::Complete | ProjectStatus::Prelaunch
    );
    if !visible && request_user.user_type != UserType::Admin {
        if let Some(request_user_id) = request_user.user_id {
            if request_user_id != project.user_id {
                return Err(ApiError::forbidden());
            }
        } else {
            return Err(ApiError::forbidden());
        }
    }

    Ok(Json(to_api_response(project)))
}
