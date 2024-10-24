use std::str::FromStr;

use chrono::Utc;
use lib_api::db::db_error::DbError;
use lib_api::db::password::hash;
use lib_types::{
    entity::user_entity::UserEntity,
    shared::user::{UserStatus, UserType},
};
use sqlx::PgPool;
use uuid::Uuid;

use crate::util::bulk_insert;

pub async fn seed(db: &PgPool) -> Result<(), DbError> {
    let table = "users";

    let data = vec![
        UserEntity {
            id: Uuid::from_str("f481a6d5-ad06-4c3e-b3a5-4af0be50bb29").unwrap(),
            name: "Admin".into(),
            description: "The Admin".into(),
            link: "https://crowdtrust.app".into(),
            location: "Singapore".into(),
            email: "admin1@crowdtrust.app".into(),
            password_hash: hash("admin.password1".into()).await.unwrap(),
            eth_address: "0x0000000000000000000000000000000000000000".into(),
            created_at: Utc::now(),
            updated_at: Utc::now(),
            user_type: UserType::Admin,
            user_status: UserStatus::Active,
            email_confirmed: true,
        },
        UserEntity {
            id: Uuid::from_str("45013993-2a1a-4ee5-8dbd-b4b63d9af34f").unwrap(),
            name: "user1@crowdtrust.app".into(),
            description: "The first user ever!".into(),
            link: "https://crowdtrust.app/user/45013993-2a1a-4ee5-8dbd-b4b63d9af34f".into(),
            location: "Tokyo".into(),
            email: "user1@crowdtrust.app".into(),
            password_hash: hash("password1".into()).await.unwrap(),
            eth_address: "0x0bfcaae5Abf40A828e6b37379F99dCbEDA712345".into(),
            created_at: Utc::now(),
            updated_at: Utc::now(),
            user_type: UserType::User,
            user_status: UserStatus::Active,
            email_confirmed: true,
        },
        UserEntity {
            id: Uuid::from_str("276168ed-9228-4d6b-aec2-ed53bb7c1901").unwrap(),
            name: "user2@crowdtrust.app".into(),
            description: "Interested in creating and backing any technology project. Email me for collaboration at coolemail@checkit.com".into(),
            link: "https://me.hello.com".into(),
            location: "San Antonio".into(),
            email: "user2@crowdtrust.app".into(),
            password_hash: hash("password2".into()).await.unwrap(),
            eth_address: "0x0000000000000000000000000000000000000002".into(),
            created_at: Utc::now(),
            updated_at: Utc::now(),
            user_type: UserType::User,
            user_status: UserStatus::Blocked,
            email_confirmed: true,
        },
        UserEntity {
            id: Uuid::from_str("00e8ee0b-843b-43e7-84c1-6d7a64cd5cfd").unwrap(),
            name: "user3@crowdtrust.app".into(),
            description: "".into(),
            link: "".into(),
            location: "Hawaii".into(),
            email: "user3@crowdtrust.app".into(),
            password_hash: hash("password3".into()).await.unwrap(),
            eth_address: "0x0000000000000000000000000000000000000003".into(),
            created_at: Utc::now(),
            updated_at: Utc::now(),
            user_type: UserType::User,
            user_status: UserStatus::Active,
            email_confirmed: false,
        },
    ];

    Ok(bulk_insert(&db, table, &data).await?)
}
