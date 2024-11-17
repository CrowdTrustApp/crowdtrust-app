use std::str::FromStr;

use chrono::{Duration, Utc};
use lib_api::db::db_error::DbError;
use lib_types::{
    entity::project_asset_entity::ProjectAssetEntity,
    shared::asset::{AssetContentType, AssetState},
};
use sqlx::PgPool;
use uuid::Uuid;

use crate::util::bulk_insert;

pub async fn seed(db: &PgPool) -> Result<(), DbError> {
    let table = "project_assets";

    let data = vec![
        ProjectAssetEntity {
            id: Uuid::from_str("7d9cb4c7-06c3-4de4-a77c-4311386387c6").unwrap(),
            project_id: Uuid::from_str("14bfe82a-1003-446b-b6bb-20a176e848e0").unwrap(),
            size: 40000,
            content_type: AssetContentType::Jpeg,
            state: AssetState::Created,
            user_id: Uuid::from_str("45013993-2a1a-4ee5-8dbd-b4b63d9af34f").unwrap(),
            upload_expires_at: Utc::now() + Duration::days(1),
            created_at: Utc::now(),
            updated_at: Utc::now(),
        },
        ProjectAssetEntity {
            id: Uuid::from_str("b59ba8f3-3b53-426a-b3db-52b2f8557798").unwrap(),
            project_id: Uuid::from_str("14bfe82a-1003-446b-b6bb-20a176e848e0").unwrap(),
            size: 1000000,
            content_type: AssetContentType::Jpeg,
            state: AssetState::Created,
            user_id: Uuid::from_str("45013993-2a1a-4ee5-8dbd-b4b63d9af34f").unwrap(),
            upload_expires_at: Utc::now() + Duration::days(1),
            created_at: Utc::now() - Duration::days(1),
            updated_at: Utc::now(),
        },
        ProjectAssetEntity {
            id: Uuid::from_str("873aa935-87e1-4e4c-8a7c-a7d8f083ed08").unwrap(),
            project_id: Uuid::from_str("00df0e23-22af-4959-874c-aca385b54eed").unwrap(),
            size: 2000000,
            content_type: AssetContentType::Png,
            state: AssetState::Uploaded,
            user_id: Uuid::from_str("00e8ee0b-843b-43e7-84c1-6d7a64cd5cfd").unwrap(),
            upload_expires_at: Utc::now() + Duration::days(1),
            created_at: Utc::now() - Duration::days(2),
            updated_at: Utc::now(),
        },
    ];

    Ok(bulk_insert(&db, table, &data).await?)
}
