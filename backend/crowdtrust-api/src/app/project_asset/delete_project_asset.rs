use axum::{
    extract::{Path, State},
    Extension,
};

use lib_api::error::api_error::ApiError;
use lib_types::shared::user::RequestUser;
use uuid::Uuid;

use crate::{
    api_context::ApiContext,
    app::{helpers::verify_admin_or_user, project::helpers::verify_project_exist},
    db::project_repo::ProjectUpdateProps,
};

use super::helpers::verify_project_asset_exist;

pub async fn delete_project_asset(
    Path(asset_id): Path<Uuid>,
    Extension(request_user): Extension<RequestUser>,
    State(context): State<ApiContext>,
) -> Result<(), ApiError> {
    // Check if the asset exists in the database
    let asset = verify_project_asset_exist(&context, asset_id).await?;
    let project = verify_project_exist(&context, asset.project_id).await?;

    // Check if the requester is the owner of the asset or an admin
    verify_admin_or_user(&request_user, asset.user_id.to_string())?;

    // Call R2 endpoint to delete the asset
    context
        .s3_client
        .delete_project_asset(&asset.relative_url())
        .await?;

    let asset_id_str = asset_id.to_string();
    let new_order = project
        .assets_order
        .into_iter()
        .filter(|id| &asset_id_str != id)
        .collect();
    context
        .repo
        .project
        .update_project(project.id, ProjectUpdateProps::asset_order(new_order))
        .await
        .map_err(|e| {
            ApiError::internal_error().message(format!("Failed to update asset order: {}", e))
        })?;

    // Remove the entry from the database
    context
        .repo
        .project_asset
        .delete_project_asset_by_id(asset_id)
        .await
        .map_err(|e| {
            ApiError::internal_error().message(format!("Failed to delete project asset: {}", e))
        })?;

    Ok(())
}
