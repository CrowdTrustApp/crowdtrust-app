use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

use crate::shared::asset::{AssetContentType, AssetState};

#[derive(Debug, Deserialize, Serialize)]
pub struct RewardAssetEntity {
    pub id: Uuid,
    pub size: i64,
    pub content_type: AssetContentType,
    pub state: AssetState,
    pub user_id: Uuid,
    pub reward_id: Uuid,
    pub upload_expires_at: DateTime<Utc>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

impl RewardAssetEntity {
    pub fn relative_url(&self, project_id: Uuid) -> String {
        let ext = self.content_type.get_ext();
        let container = project_id.to_string();

        format!("{}/{}.{}", container, self.id.to_string(), ext)
    }
}
