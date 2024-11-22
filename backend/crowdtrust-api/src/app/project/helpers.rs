use lib_api::error::api_error::ApiError;
use lib_types::entity::project_entity::ProjectEntity;
use uuid::Uuid;

use crate::api_context::ApiContext;

pub async fn verify_project_exist(
    context: &ApiContext,
    id: Uuid,
) -> Result<ProjectEntity, ApiError> {
    let project = context
        .repo
        .project
        .get_project_by_id(id)
        .await
        .map_err(|_| ApiError::not_found().message("Project not found"))?;
    Ok(project)
}
