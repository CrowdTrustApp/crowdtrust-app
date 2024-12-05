use std::str::FromStr;

use chrono::Utc;
use lib_api::db::db_error::DbError;
use lib_types::{entity::pledge_entity::PledgeItemEntity, shared::project::PaymentCurrency};
use sqlx::PgPool;
use uuid::Uuid;

use crate::util::bulk_insert;

pub async fn seed(db: &PgPool) -> Result<(), DbError> {
    let table = "pledge_items";

    let data = vec![
        PledgeItemEntity {
            id: Uuid::from_str("d028c7c7-2422-4864-b8be-5d24071f89f3").unwrap(),
            pledge_id: Uuid::from_str("8e766cf6-c74a-4263-9974-4a0c201b728c").unwrap(),
            reward_id: Uuid::from_str("1ab089a5-89eb-458f-bf04-15518e9e866f").unwrap(),
            quantity: 2,
            paid_price: 50000000000000000i128.into(),
            paid_currency: PaymentCurrency::Ethereum,
            created_at: Utc::now(),
            updated_at: Utc::now(),
        },
        PledgeItemEntity {
            id: Uuid::from_str("bccc7f22-d8c9-4bef-adbc-e0804def90e6").unwrap(),
            pledge_id: Uuid::from_str("8e766cf6-c74a-4263-9974-4a0c201b728c").unwrap(),
            reward_id: Uuid::from_str("950d06e5-8c8b-4060-a6e4-7a676fbc223e").unwrap(),
            quantity: 1,
            paid_price: 100000000000000000i128.into(),
            paid_currency: PaymentCurrency::Ethereum,
            created_at: Utc::now(),
            updated_at: Utc::now(),
        },
        PledgeItemEntity {
            id: Uuid::from_str("d0742e9a-86c3-4a0a-9731-1395c7f7fc62").unwrap(),
            pledge_id: Uuid::from_str("ac69089a-fbe6-4879-bbb2-ced6446092c0").unwrap(),
            reward_id: Uuid::from_str("1ab089a5-89eb-458f-bf04-15518e9e866f").unwrap(),
            quantity: 1,
            paid_price: 50000000000000000i128.into(),
            paid_currency: PaymentCurrency::Ethereum,
            created_at: Utc::now(),
            updated_at: Utc::now(),
        },
        PledgeItemEntity {
            id: Uuid::from_str("d80c42bf-2cd0-422f-96b9-b78d98f72589").unwrap(),
            pledge_id: Uuid::from_str("23c0599a-7990-4949-820c-3254079955f2").unwrap(),
            reward_id: Uuid::from_str("8fe4b678-e9ac-4e1d-b37a-1254ec33656f").unwrap(),
            quantity: 1,
            paid_price: 100000000000000000i128.into(),
            paid_currency: PaymentCurrency::Ethereum,
            created_at: Utc::now(),
            updated_at: Utc::now(),
        },
    ];

    Ok(bulk_insert(&db, table, &data).await?)
}
