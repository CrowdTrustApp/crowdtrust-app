use bigdecimal::BigDecimal;
use chrono::{DateTime, Utc};
use serde::Serialize;
use uuid::Uuid;

use crate::{
    dto::reward::reward_view_model::{self, RewardViewModel},
    entity::project_entity::ProjectEntityRelations,
    shared::project::{BlockchainStatus, PaymentCurrency, ProjectCategory, ProjectStatus},
};

#[derive(Serialize)]
pub struct GetProjectResponse {
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
    pub rewards: Vec<RewardViewModel>,
    pub rewards_order: Vec<String>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

pub fn serialize_big(dec: &BigDecimal) -> String {
    dec.with_scale(0).to_string()
}

pub fn to_api_response(user_entity: ProjectEntityRelations) -> GetProjectResponse {
    return GetProjectResponse {
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
        rewards: user_entity
            .rewards
            .into_iter()
            .map(reward_view_model::to_api_response)
            .collect(),
        rewards_order: user_entity.rewards_order,
        created_at: user_entity.created_at,
        updated_at: user_entity.updated_at,
    };
}
