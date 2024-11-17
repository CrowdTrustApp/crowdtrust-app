use axum::{
    extract::{Path, State},
    Extension, Json,
};
use chrono::Utc;
use lib_api::error::api_error::ApiError;
use lib_types::{
    dto::project_asset::verify_project_asset_dto::VerifyProjectAssetResponse,
    shared::{asset::AssetState, user::RequestUser},
};
use uuid::Uuid;

use crate::{api_context::ApiContext, app::helpers::verify_admin_or_user};

use super::helpers::verify_project_asset_exist;

pub async fn verify_project_asset(
    Path(asset_id): Path<Uuid>,
    Extension(request_user): Extension<RequestUser>,
    State(context): State<ApiContext>,
) -> Result<Json<VerifyProjectAssetResponse>, ApiError> {
    let project_asset = verify_project_asset_exist(&context, asset_id).await?;

    // Check if the asset belongs to the current user
    verify_admin_or_user(&request_user, project_asset.user_id.to_string())?;

    // Perform a HEAD request to check if the object exists
    let exists = context
        .s3_client
        .verify_project_asset(&project_asset.relative_url())
        .await?;

    // Determine the state based on the verification result and expiration time
    let now = Utc::now();
    let state = if exists {
        AssetState::Uploaded
    } else if now > project_asset.upload_expires_at {
        AssetState::Expired
    } else {
        AssetState::Created
    };

    // Update the state of the project asset in the repository
    context
        .repo
        .project_asset
        .update_project_asset_state(asset_id, state)
        .await
        .map_err(|e| {
            ApiError::internal_error().message(format!("Failed to update project asset: {}", e))
        })?;

    Ok(Json(VerifyProjectAssetResponse { verified: exists }))
}
