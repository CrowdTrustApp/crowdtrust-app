use std::str::FromStr;

use chrono::{Duration, Utc};
use lib_api::db::db_error::DbError;
use lib_types::{entity::pledge_entity::PledgeEntity, shared::project::BlockchainStatus};
use sqlx::PgPool;
use uuid::Uuid;

use crate::util::bulk_insert;

pub async fn seed(db: &PgPool) -> Result<(), DbError> {
    let table = "pledges";

    let data = vec![
        PledgeEntity {
            id: Uuid::from_str("8e766cf6-c74a-4263-9974-4a0c201b728c").unwrap(),
            project_id: Uuid::from_str("14bfe82a-1003-446b-b6bb-20a176e848e0").unwrap(),
            user_id: Uuid::from_str("276168ed-9228-4d6b-aec2-ed53bb7c1901").unwrap(),
            comment: "".into(),
            blockchain_status: BlockchainStatus::None,
            transaction_hash: None,
            created_at: Utc::now() - Duration::days(20),
            updated_at: Utc::now(),
        },
        PledgeEntity {
            id: Uuid::from_str("ac69089a-fbe6-4879-bbb2-ced6446092c0").unwrap(),
            project_id: Uuid::from_str("14bfe82a-1003-446b-b6bb-20a176e848e0").unwrap(),
            user_id: Uuid::from_str("00e8ee0b-843b-43e7-84c1-6d7a64cd5cfd").unwrap(),
            comment: "123 Fake Street, Nowhere CA".into(),
            blockchain_status: BlockchainStatus::None,
            transaction_hash: None,
            created_at: Utc::now() - Duration::days(18),
            updated_at: Utc::now(),
        },
        PledgeEntity {
            id: Uuid::from_str("23c0599a-7990-4949-820c-3254079955f2").unwrap(),
            project_id: Uuid::from_str("3e42e273-546d-4989-a97c-f6eb173e8450").unwrap(),
            user_id: Uuid::from_str("00e8ee0b-843b-43e7-84c1-6d7a64cd5cfd").unwrap(),
            comment: "My Address".into(),
            blockchain_status: BlockchainStatus::Success,
            transaction_hash: Some(
                "0x123454292f1680730fe8803949c8ddf9fbe8256da1ff86bc9b304b35a3f00000".into(),
            ),
            created_at: Utc::now() - Duration::days(16),
            updated_at: Utc::now(),
        },
    ];

    Ok(bulk_insert(&db, table, &data).await?)
}
