use std::str::FromStr;

use chrono::Utc;
use lib_api::db::db_error::DbError;
use lib_types::entity::pledge_entity::PledgeEntity;
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
            created_at: Utc::now(),
            updated_at: Utc::now(),
        },
        PledgeEntity {
            id: Uuid::from_str("ac69089a-fbe6-4879-bbb2-ced6446092c0").unwrap(),
            project_id: Uuid::from_str("14bfe82a-1003-446b-b6bb-20a176e848e0").unwrap(),
            user_id: Uuid::from_str("00e8ee0b-843b-43e7-84c1-6d7a64cd5cfd").unwrap(),
            comment: "123 Fake Street, Nowhere CA".into(),
            created_at: Utc::now(),
            updated_at: Utc::now(),
        },
        PledgeEntity {
            id: Uuid::from_str("23c0599a-7990-4949-820c-3254079955f2").unwrap(),
            project_id: Uuid::from_str("3e42e273-546d-4989-a97c-f6eb173e8450").unwrap(),
            user_id: Uuid::from_str("00e8ee0b-843b-43e7-84c1-6d7a64cd5cfd").unwrap(),
            comment: "My Address".into(),
            created_at: Utc::now(),
            updated_at: Utc::now(),
        },
    ];

    Ok(bulk_insert(&db, table, &data).await?)
}
