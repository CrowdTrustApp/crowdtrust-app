use bigdecimal::BigDecimal;
use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

use crate::shared::{
    asset::{AssetContentType, AssetState},
    project::{BlockchainStatus, PaymentCurrency, ProjectCategory, ProjectStatus},
};

use super::reward_entity::RewardEntity;

#[derive(Debug, Deserialize, Serialize, sqlx::Type)]
pub struct ProjectEntity {
    pub id: Uuid,
    pub user_id: Uuid,
    pub name: String,
    pub description: String,
    pub blurb: String,
    pub contract_address: String,
    pub payment_address: String,
    pub category: ProjectCategory,
    pub funding_goal: BigDecimal,
    pub start_time: i64,
    pub duration: i64,
    pub total_pledged: BigDecimal,
    pub backer_count: i32,
    pub base_currency: PaymentCurrency,
    pub status: ProjectStatus,
    pub blockchain_status: BlockchainStatus,
    pub transaction_hash: Option<String>,
    pub rewards_order: Vec<String>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Deserialize, Serialize, sqlx::Type)]
pub struct ProjectEntityRelations {
    pub id: Uuid,
    pub user_id: Uuid,
    pub name: String,
    pub description: String,
    pub blurb: String,
    pub contract_address: String,
    pub payment_address: String,
    pub category: ProjectCategory,
    pub funding_goal: BigDecimal,
    pub start_time: i64,
    pub duration: i64,
    pub total_pledged: BigDecimal,
    pub backer_count: i32,
    pub base_currency: PaymentCurrency,
    pub status: ProjectStatus,
    pub blockchain_status: BlockchainStatus,
    pub transaction_hash: Option<String>,
    pub rewards: Vec<RewardEntity>,
    pub rewards_order: Vec<String>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Deserialize, Serialize, sqlx::Type)]
pub struct ProjectAssetEntity {
    pub id: Uuid,
    pub project_id: Uuid,
    pub user_id: Uuid,
    pub size: i64,
    pub name: String,
    pub content_type: AssetContentType,
    pub state: AssetState,
    pub upload_expires_at: DateTime<Utc>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug)]
pub struct ProjectListResults {
    pub total: i64,
    pub results: Vec<ProjectEntity>,
}

pub struct ProjectCreateResult {
    pub id: Uuid,
}
