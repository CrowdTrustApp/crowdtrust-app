use std::str::FromStr;

use chrono::{Duration, Utc};
use lib_api::db::db_error::DbError;
use lib_types::{
    entity::reward_entity::RewardAssetEntity,
    shared::asset::{AssetContentType, AssetState},
};
use sqlx::PgPool;
use uuid::Uuid;

use crate::util::bulk_insert;

pub async fn seed(db: &PgPool) -> Result<(), DbError> {
    let table = "reward_assets";

    let data = vec![
        RewardAssetEntity {
            id: Uuid::from_str("2ba44fde-f25a-4c07-a9f0-b18186ef69a6").unwrap(),
            reward_id: Uuid::from_str("1ab089a5-89eb-458f-bf04-15518e9e866f").unwrap(),
            size: 40000,
            content_type: AssetContentType::Jpeg,
            state: AssetState::Created,
            user_id: Uuid::from_str("45013993-2a1a-4ee5-8dbd-b4b63d9af34f").unwrap(),
            upload_expires_at: Utc::now() + Duration::days(1),
            created_at: Utc::now(),
            updated_at: Utc::now(),
        },
        RewardAssetEntity {
            id: Uuid::from_str("d592f9e2-0901-4bbd-907a-006b7c4e8f34").unwrap(),
            reward_id: Uuid::from_str("f99aa7f1-fc8a-4073-aff7-beaa1bbdfb3a").unwrap(),
            size: 1000000,
            content_type: AssetContentType::Jpeg,
            state: AssetState::Created,
            user_id: Uuid::from_str("45013993-2a1a-4ee5-8dbd-b4b63d9af34f").unwrap(),
            upload_expires_at: Utc::now() + Duration::days(1),
            created_at: Utc::now() - Duration::days(1),
            updated_at: Utc::now(),
        },
        RewardAssetEntity {
            id: Uuid::from_str("a8cdf436-3d7a-463a-81ac-dfb7f3bad57a").unwrap(),
            reward_id: Uuid::from_str("950d06e5-8c8b-4060-a6e4-7a676fbc223e").unwrap(),
            size: 2000000,
            content_type: AssetContentType::Png,
            state: AssetState::Created,
            user_id: Uuid::from_str("45013993-2a1a-4ee5-8dbd-b4b63d9af34f").unwrap(),
            upload_expires_at: Utc::now() + Duration::days(1),
            created_at: Utc::now() - Duration::days(2),
            updated_at: Utc::now(),
        },
    ];

    Ok(bulk_insert(&db, table, &data).await?)
}
