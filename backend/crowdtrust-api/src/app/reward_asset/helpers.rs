use lib_api::error::api_error::ApiError;
use lib_types::entity::reward_asset_entity::RewardAssetEntity;
use uuid::Uuid;

use crate::api_context::ApiContext;

pub async fn verify_reward_asset_exist(
    context: &ApiContext,
    id: Uuid,
) -> Result<RewardAssetEntity, ApiError> {
    let asset = context
        .repo
        .reward_asset
        .get_reward_asset_by_id(id)
        .await
        .map_err(|_| ApiError::not_found().message("Reward asset not found"))?;
    Ok(asset)
}
