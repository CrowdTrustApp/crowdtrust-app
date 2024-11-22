use lib_api::error::api_error::ApiError;
use lib_types::entity::reward_entity::RewardEntity;
use uuid::Uuid;

use crate::api_context::ApiContext;

pub async fn verify_reward_exist(context: &ApiContext, id: Uuid) -> Result<RewardEntity, ApiError> {
    let asset = context
        .repo
        .reward
        .get_reward_by_id(id)
        .await
        .map_err(|_| ApiError::not_found().message("Reward not found"))?;
    Ok(asset)
}
