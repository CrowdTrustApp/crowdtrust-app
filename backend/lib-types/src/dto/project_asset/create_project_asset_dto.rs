use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use uuid::Uuid;
use validator::Validate;

use crate::{
    entity::project_asset_entity::ProjectAssetEntity,
    shared::asset::{AssetContentType, AssetState},
    type_util::REGEX_UUID,
};

#[derive(Deserialize, Validate)]
#[serde(deny_unknown_fields)]
pub struct CreateProjectAssetDto {
    #[validate(range(min = 0, max = 1000000000))]
    pub content_size: i64,
    pub content_type: AssetContentType,
    #[validate(regex(path = "*REGEX_UUID"))]
    pub project_id: String,
}

#[derive(Serialize)]
pub struct CreateProjectAssetResponse {
    pub id: Uuid,
    pub signed_url: String,
    pub size: i64,
    pub content_type: String,
    pub state: AssetState,
    pub user_id: Uuid,
    pub project_id: Uuid,
    pub upload_expires_at: DateTime<Utc>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

pub fn to_api_response(
    entity: ProjectAssetEntity,
    signed_url: String,
) -> CreateProjectAssetResponse {
    return CreateProjectAssetResponse {
        id: entity.id,
        signed_url,
        size: entity.size,
        content_type: entity.content_type.to_string(),
        state: entity.state,
        user_id: entity.user_id,
        project_id: entity.project_id,
        upload_expires_at: entity.upload_expires_at,
        created_at: entity.created_at,
        updated_at: entity.updated_at,
    };
}
