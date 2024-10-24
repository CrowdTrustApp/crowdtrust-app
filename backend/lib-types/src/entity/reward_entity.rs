use bigdecimal::BigDecimal;
use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

use crate::shared::asset::{AssetContentType, AssetState};

#[derive(Debug, Deserialize, Serialize, sqlx::Type)]
pub struct RewardEntity {
    pub id: Uuid,
    pub project_id: Uuid,
    pub name: String,
    pub description: String,
    pub delivery_time: i64,
    pub price: BigDecimal,
    pub backer_limit: i32,
    pub backer_count: i32,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Deserialize, Serialize, sqlx::Type)]
pub struct RewardAssetEntity {
    pub id: Uuid,
    pub reward_id: Uuid,
    pub user_id: Uuid,
    pub size: i64,
    pub name: String,
    pub content_type: AssetContentType,
    pub state: AssetState,
    pub upload_expires_at: DateTime<Utc>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}
