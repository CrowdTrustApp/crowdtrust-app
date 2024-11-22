use serde::Deserialize;
use uuid::Uuid;
use validator::Validate;

use crate::{
    dto::project_asset::create_project_asset_dto::CreateProjectAssetResponse,
    entity::reward_asset_entity::RewardAssetEntity, shared::asset::AssetContentType,
    type_util::REGEX_UUID,
};

#[derive(Deserialize, Validate)]
#[serde(deny_unknown_fields)]
pub struct CreateRewardAssetDto {
    #[validate(range(min = 0, max = 20000000))]
    pub content_size: i64,
    pub content_type: AssetContentType,
    #[validate(regex(path = "*REGEX_UUID"))]
    pub reward_id: String,
}

pub fn to_api_response(
    entity: RewardAssetEntity,
    project_id: Uuid,
    signed_url: String,
) -> CreateProjectAssetResponse {
    return CreateProjectAssetResponse {
        id: entity.id,
        signed_url,
        size: entity.size,
        content_type: entity.content_type.to_string(),
        state: entity.state,
        user_id: entity.user_id,
        project_id,
        upload_expires_at: entity.upload_expires_at,
        created_at: entity.created_at,
        updated_at: entity.updated_at,
    };
}
