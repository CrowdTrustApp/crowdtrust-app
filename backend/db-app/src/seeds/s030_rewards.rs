use std::str::FromStr;

use bigdecimal::BigDecimal;
use chrono::{DateTime, Duration, Utc};
use lib_api::db::db_error::DbError;
use serde::Serialize;
use sqlx::PgPool;
use uuid::Uuid;

use crate::util::bulk_insert;

#[derive(Debug, Serialize, sqlx::Type)]
pub struct RewardEntityDbProps {
    pub id: Uuid,
    pub project_id: Uuid,
    pub name: String,
    pub description: String,
    pub delivery_time: i64,
    pub price: BigDecimal,
    pub backer_limit: i32,
    pub backer_count: i32,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

pub async fn seed(db: &PgPool) -> Result<(), DbError> {
    let table = "rewards";

    let data = vec![
        RewardEntityDbProps {
            id: Uuid::from_str("1ab089a5-89eb-458f-bf04-15518e9e866f").unwrap(),
            project_id: Uuid::from_str("14bfe82a-1003-446b-b6bb-20a176e848e0").unwrap(),
            name: "Basic Handheld".into(),
            description: "The barebones GameBox.".into(),
            delivery_time: (Utc::now() + Duration::weeks(24)).timestamp(),
            price: 50000000000000000i128.into(),
            backer_limit: 1000,
            backer_count: 0,
            created_at: Utc::now(),
            updated_at: Utc::now(),
        },
        RewardEntityDbProps {
            id: Uuid::from_str("950d06e5-8c8b-4060-a6e4-7a676fbc223e").unwrap(),
            project_id: Uuid::from_str("14bfe82a-1003-446b-b6bb-20a176e848e0").unwrap(),
            name: "Advanced Handheld".into(),
            description: "The GameBox with hi-def screen and secret game.".into(),
            delivery_time: (Utc::now() + Duration::weeks(32)).timestamp(),
            price: 100000000000000000i128.into(),
            backer_limit: 200,
            backer_count: 0,
            created_at: Utc::now(),
            updated_at: Utc::now(),
        },
        RewardEntityDbProps {
            id: Uuid::from_str("f99aa7f1-fc8a-4073-aff7-beaa1bbdfb3a").unwrap(),
            project_id: Uuid::from_str("fa4d21c2-16a3-46cf-8162-98f4a82b59aa").unwrap(),
            name: "Basic Sphere".into(),
            description: "One basic Hi-Fi Sphere speaker.".into(),
            delivery_time: (Utc::now() + Duration::weeks(32)).timestamp(),
            price: 100000000000000000i128.into(),
            backer_limit: 400,
            backer_count: 97,
            created_at: Utc::now(),
            updated_at: Utc::now(),
        },
        RewardEntityDbProps {
            id: Uuid::from_str("28046fdd-9e47-441d-8142-8f556e5d825c").unwrap(),
            project_id: Uuid::from_str("fa4d21c2-16a3-46cf-8162-98f4a82b59aa").unwrap(),
            name: "Pro Sphere".into(),
            description: "One Pro version of the sphere with free upgrades.".into(),
            delivery_time: (Utc::now() + Duration::weeks(32)).timestamp(),
            price: 200000000000000000i128.into(),
            backer_limit: 100,
            backer_count: 0,
            created_at: Utc::now(),
            updated_at: Utc::now(),
        },
        RewardEntityDbProps {
            id: Uuid::from_str("8fe4b678-e9ac-4e1d-b37a-1254ec33656f").unwrap(),
            project_id: Uuid::from_str("3e42e273-546d-4989-a97c-f6eb173e8450").unwrap(),
            name: "Record Player Early".into(),
            description: "Early bird reward for our advanced vintage record player.".into(),
            delivery_time: (Utc::now() + Duration::weeks(36)).timestamp(),
            price: 100000000000000000i128.into(),
            backer_limit: 2,
            backer_count: 1,
            created_at: Utc::now(),
            updated_at: Utc::now(),
        },
        RewardEntityDbProps {
            id: Uuid::from_str("b63ae027-4c66-496d-87ff-cf610a161309").unwrap(),
            project_id: Uuid::from_str("3e42e273-546d-4989-a97c-f6eb173e8450").unwrap(),
            name: "Record Player".into(),
            description: "Our advanced vintage record player.".into(),
            delivery_time: (Utc::now() + Duration::weeks(40)).timestamp(),
            price: 150000000000000000i128.into(),
            backer_limit: 1000,
            backer_count: 0,
            created_at: Utc::now(),
            updated_at: Utc::now(),
        },
    ];

    Ok(bulk_insert(&db, table, &data).await?)
}
