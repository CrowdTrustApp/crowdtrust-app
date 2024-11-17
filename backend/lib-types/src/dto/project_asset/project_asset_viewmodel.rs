use serde::Serialize;
use uuid::Uuid;

use crate::{
    entity::project_asset_entity::ProjectAssetEntity,
    shared::{asset::AssetState, js_date::JsDate},
};

#[derive(Serialize)]
pub struct ProjectAssetViewModel {
    pub id: Uuid,
    pub size: i64,
    pub content_type: String,
    pub state: AssetState,
    pub user_id: Uuid,
    pub project_id: Uuid,
    pub upload_expires_at: JsDate,
    pub created_at: JsDate,
    pub updated_at: JsDate,
}

pub fn to_api_response(entity: ProjectAssetEntity) -> ProjectAssetViewModel {
    return ProjectAssetViewModel {
        id: entity.id,
        size: entity.size,
        content_type: entity.content_type.to_string(),
        state: entity.state,
        user_id: entity.user_id,
        project_id: entity.project_id,
        upload_expires_at: JsDate {
            timestamp: entity.upload_expires_at,
        },
        created_at: JsDate {
            timestamp: entity.created_at,
        },
        updated_at: JsDate {
            timestamp: entity.updated_at,
        },
    };
}
