use axum::{
    extract::{Path, State},
    Extension,
};

use lib_api::error::api_error::ApiError;
use lib_types::shared::user::RequestUser;
use uuid::Uuid;

use crate::{
    api_context::ApiContext,
    app::{helpers::verify_admin_or_user, reward::helpers::verify_reward_exist},
};

use super::helpers::verify_reward_asset_exist;

pub async fn delete_reward_asset(
    Path(asset_id): Path<Uuid>,
    Extension(request_user): Extension<RequestUser>,
    State(context): State<ApiContext>,
) -> Result<(), ApiError> {
    // Check if the asset exists in the database
    let asset = verify_reward_asset_exist(&context, asset_id).await?;
    let reward = verify_reward_exist(&context, asset.reward_id).await?;

    // Check if the requester is the owner of the asset or an admin
    verify_admin_or_user(&request_user, asset.user_id.to_string())?;

    // Call R2 endpoint to delete the asset
    context
        .s3_client
        .delete_project_asset(&asset.relative_url(reward.project_id))
        .await?;

    // Remove the entry from the database
    context
        .repo
        .reward_asset
        .delete_reward_asset_by_id(asset_id)
        .await
        .map_err(|e| {
            ApiError::internal_error().message(format!("Failed to delete reward asset: {}", e))
        })?;

    Ok(())
}
