use bigdecimal::BigDecimal;
use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

use crate::shared::project::{BlockchainStatus, PaymentCurrency};

#[derive(Debug, Deserialize, Serialize, sqlx::Type)]
pub struct PledgeEntity {
    pub id: Uuid,
    pub project_id: Uuid,
    pub user_id: Uuid,
    pub comment: String,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Deserialize, Serialize, sqlx::Type)]
pub struct PledgeItemEntity {
    pub id: Uuid,
    pub pledge_id: Uuid,
    pub reward_id: Uuid,
    pub quantity: i32,
    pub paid_price: BigDecimal,
    pub paid_currency: PaymentCurrency,
    pub blockchain_status: BlockchainStatus,
    pub transaction_hash: Option<String>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}
