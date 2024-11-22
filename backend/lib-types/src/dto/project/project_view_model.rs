use chrono::{DateTime, Utc};
use serde::Serialize;
use uuid::Uuid;

use crate::{
    entity::project_entity::ProjectEntity,
    shared::{
        asset::AssetContentType,
        project::{BlockchainStatus, PaymentCurrency, ProjectCategory, ProjectStatus},
    },
};

use super::get_project_dto::serialize_big;

#[derive(Serialize)]
pub struct ProjectViewModel {
    pub id: Uuid,
    pub user_id: Uuid,
    pub name: String,
    pub description: String,
    pub blurb: String,
    pub contract_address: String,
    pub payment_address: String,
    pub category: ProjectCategory,
    pub funding_goal: String,
    pub start_time: i64,
    pub duration: i64,
    pub total_pledged: String,
    pub backer_count: i32,
    pub base_currency: PaymentCurrency,
    pub status: ProjectStatus,
    pub blockchain_status: BlockchainStatus,
    pub transaction_hash: Option<String>,
    pub rewards_order: Vec<String>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

pub fn to_api_response(user_entity: ProjectEntity) -> ProjectViewModel {
    return ProjectViewModel {
        id: user_entity.id,
        user_id: user_entity.user_id,
        name: user_entity.name,
        description: user_entity.description,
        blurb: user_entity.blurb,
        contract_address: user_entity.contract_address,
        payment_address: user_entity.payment_address,
        category: user_entity.category,
        funding_goal: serialize_big(&user_entity.funding_goal),
        start_time: user_entity.start_time,
        duration: user_entity.duration,
        total_pledged: serialize_big(&user_entity.total_pledged),
        backer_count: user_entity.backer_count,
        base_currency: user_entity.base_currency,
        status: user_entity.status,
        blockchain_status: user_entity.blockchain_status,
        transaction_hash: user_entity.transaction_hash,
        rewards_order: user_entity.rewards_order,
        created_at: user_entity.created_at,
        updated_at: user_entity.updated_at,
    };
}

#[derive(Serialize)]
pub struct ProjectAssetViewModelRelation {
    pub id: Uuid,
    pub content_type: AssetContentType,
    pub size: i64,
    pub project_id: Uuid,
}
