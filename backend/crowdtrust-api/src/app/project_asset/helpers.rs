use lib_api::error::api_error::ApiError;
use lib_types::entity::project_asset_entity::ProjectAssetEntity;
use uuid::Uuid;

use crate::api_context::ApiContext;

pub async fn verify_project_asset_exist(
    context: &ApiContext,
    id: Uuid,
) -> Result<ProjectAssetEntity, ApiError> {
    let asset = context
        .repo
        .project_asset
        .get_project_asset_by_id(id)
        .await
        .map_err(|_| ApiError::not_found().message("Project asset not found"))?;
    Ok(asset)
}
