use chrono::{DateTime, Utc};
use serde::Serialize;
use uuid::Uuid;

use crate::{
    dto::project::get_project_dto::serialize_big,
    entity::pledge_entity::{PledgeEntity, PledgeEntityRelations, PledgeItemEntity},
    shared::project::{BlockchainStatus, PaymentCurrency},
};

#[derive(Serialize)]
pub struct PledgeViewModel {
    pub id: Uuid,
    pub project_id: Uuid,
    pub user_id: Uuid,
    pub comment: String,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Serialize)]
pub struct GetPledgeViewModel {
    pub id: Uuid,
    pub project_id: Uuid,
    pub user_id: Uuid,
    pub comment: String,
    pub pledge_items: Vec<PledgeItemViewModel>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Serialize)]
pub struct PledgeItemViewModel {
    pub id: Uuid,
    pub pledge_id: Uuid,
    pub reward_id: Uuid,
    pub quantity: i32,
    pub paid_price: String,
    pub paid_currency: PaymentCurrency,
    pub blockchain_status: BlockchainStatus,
    pub transaction_hash: Option<String>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

pub fn to_api_response(entity: PledgeEntity) -> PledgeViewModel {
    return PledgeViewModel {
        id: entity.id,
        project_id: entity.project_id,
        user_id: entity.user_id,
        comment: entity.comment,
        created_at: entity.created_at,
        updated_at: entity.updated_at,
    };
}

fn pledge_item_api_response(entity: PledgeItemEntity) -> PledgeItemViewModel {
    PledgeItemViewModel {
        id: entity.id,
        pledge_id: entity.pledge_id,
        reward_id: entity.reward_id,
        quantity: entity.quantity,
        paid_price: serialize_big(&entity.paid_price),
        paid_currency: entity.paid_currency,
        blockchain_status: entity.blockchain_status,
        transaction_hash: entity.transaction_hash,
        created_at: entity.created_at,
        updated_at: entity.updated_at,
    }
}

pub fn to_api_response_relations(entity: PledgeEntityRelations) -> GetPledgeViewModel {
    return GetPledgeViewModel {
        id: entity.id,
        project_id: entity.project_id,
        user_id: entity.user_id,
        comment: entity.comment,
        pledge_items: entity
            .pledge_items
            .into_iter()
            .map(pledge_item_api_response)
            .collect(),
        created_at: entity.created_at,
        updated_at: entity.updated_at,
    };
}
