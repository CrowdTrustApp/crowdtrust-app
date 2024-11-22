use axum::{
    extract::{Path, State},
    Extension, Json,
};
use chrono::Utc;
use lib_api::error::api_error::ApiError;
use lib_types::{
    dto::reward_asset::verify_reward_asset_dto::VerifyRewardAssetResponse,
    shared::{asset::AssetState, user::RequestUser},
};
use uuid::Uuid;

use crate::{
    api_context::ApiContext,
    app::{helpers::verify_admin_or_user, reward::helpers::verify_reward_exist},
};

use super::helpers::verify_reward_asset_exist;

pub async fn verify_reward_asset(
    Path(asset_id): Path<Uuid>,
    Extension(request_user): Extension<RequestUser>,
    State(context): State<ApiContext>,
) -> Result<Json<VerifyRewardAssetResponse>, ApiError> {
    let reward_asset = verify_reward_asset_exist(&context, asset_id).await?;
    let reward = verify_reward_exist(&context, reward_asset.reward_id).await?;

    // Check if the asset belongs to the current user
    verify_admin_or_user(&request_user, reward_asset.user_id.to_string())?;

    // Perform a HEAD request to check if the object exists
    let exists = context
        .s3_client
        .verify_project_asset(&reward_asset.relative_url(reward.project_id))
        .await?;

    // Determine the state based on the verification result and expiration time
    let now = Utc::now();
    let state = if exists {
        AssetState::Uploaded
    } else if now > reward_asset.upload_expires_at {
        AssetState::Expired
    } else {
        AssetState::Created
    };

    // Update the state of the reward asset in the repository
    context
        .repo
        .reward_asset
        .update_reward_asset_state(asset_id, state)
        .await
        .map_err(|e| {
            ApiError::internal_error().message(format!("Failed to update reward asset: {}", e))
        })?;

    Ok(Json(VerifyRewardAssetResponse { verified: exists }))
}
