use std::str::FromStr;

use bigdecimal::BigDecimal;
use chrono::{DateTime, Duration, Utc};
use lib_api::db::db_error::DbError;
use lib_types::shared::project::{
    BlockchainStatus, PaymentCurrency, ProjectCategory, ProjectStatus,
};
use serde::Serialize;
use sqlx::PgPool;
use uuid::Uuid;

use crate::util::bulk_insert;

#[derive(Debug, Serialize, sqlx::Type)]
pub struct ProjectEntityDbProps {
    pub id: Uuid,
    pub user_id: Uuid,
    pub name: String,
    pub description: String,
    pub blurb: String,
    pub contract_address: String,
    pub payment_address: String,
    pub category: ProjectCategory,
    pub funding_goal: BigDecimal,
    pub start_time: i64,
    pub duration: i64,
    pub total_pledged: BigDecimal,
    pub backer_count: i32,
    pub base_currency: PaymentCurrency,
    pub status: ProjectStatus,
    pub assets_order: Vec<String>,
    pub blockchain_status: BlockchainStatus,
    pub transaction_hash: Option<String>,
    pub rewards_order: Vec<String>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

pub async fn seed(db: &PgPool) -> Result<(), DbError> {
    let table = "projects";

    let data = vec![
        ProjectEntityDbProps {
            id: Uuid::from_str("14bfe82a-1003-446b-b6bb-20a176e848e0").unwrap(),
            user_id: Uuid::from_str("45013993-2a1a-4ee5-8dbd-b4b63d9af34f").unwrap(),
            name: "Game Box".into(),
            description: "A revolutionary new handheld gaming device capable of emulating all previous systems as well as exciting new titles.\n\nThis project is for demonstration purposes only, backing is disabled.".into(),
            blurb: "Revolutionizing handheld gaming!".into(),
            contract_address: "0x0000000000000000000000000000000000000000".into(),
            payment_address: "0x0000000000000000000000000000000000000000".into(),
            category: ProjectCategory::Games,
            funding_goal: 10000000000000000000i128.into(),
            start_time: (Utc::now() + Duration::days(1)).timestamp(),
            duration: Duration::days(30).num_seconds(),
            total_pledged: 0.into(),
            backer_count: 0,
            base_currency: PaymentCurrency::Ethereum,
            rewards_order: vec!["1ab089a5-89eb-458f-bf04-15518e9e866f".into(), "950d06e5-8c8b-4060-a6e4-7a676fbc223e".into()],
            assets_order: vec![
                "7d9cb4c7-06c3-4de4-a77c-4311386387c6".into(),
                "b59ba8f3-3b53-426a-b3db-52b2f8557798".into(),
                "4cba9ed0-eb4e-4764-8458-a4ca6eecb35c".into(),
                "439f93a5-bbb6-4353-b3aa-0f766612dc53".into()
            ],
            status: ProjectStatus::Initial,
            blockchain_status: BlockchainStatus::None,
            transaction_hash: None,
            created_at: Utc::now() - Duration::days(1),
            updated_at: Utc::now(),
        },
        ProjectEntityDbProps {
            id: Uuid::from_str("a3a2b1c4-a1ee-42d5-a729-bb6ff6fdfdfe").unwrap(),
            user_id: Uuid::from_str("45013993-2a1a-4ee5-8dbd-b4b63d9af34f").unwrap(),
            name: "Super Jetpack".into(),
            description: "An actual real jetpack that really works.\n\nThis project is for demonstration purposes only, backing is disabled.".into(),
            blurb: "Get your flight on!".into(),
            contract_address: "0x0000000000000000000000000000000000000000".into(),
            payment_address: "0x0000000000000000000000000000000000000000".into(),
            category: ProjectCategory::Technology,
            funding_goal: 100000000000000000000i128.into(),
            start_time: (Utc::now() + Duration::days(1)).timestamp(),
            duration: Duration::days(45).num_seconds(),
            total_pledged: 0.into(),
            backer_count: 0,
            base_currency: PaymentCurrency::Ethereum,
            rewards_order: vec![],
            assets_order: vec![],
            status: ProjectStatus::Review,
            blockchain_status: BlockchainStatus::None,
            transaction_hash: None,
            created_at: Utc::now() - Duration::days(5),
            updated_at: Utc::now(),
        },
        ProjectEntityDbProps {
            id: Uuid::from_str("d13b990d-172e-4a01-aeea-43f6ef505a7c").unwrap(),
            user_id: Uuid::from_str("45013993-2a1a-4ee5-8dbd-b4b63d9af34f").unwrap(),
            name: "Donate to the needy".into(),
            description: "Donate a dollar or two to help those in need. Whatever you can provide helps!\n\nThis project is for demonstration purposes only, backing is disabled.".into(),
            blurb: "Collecting donations for the hungry and un-housed.".into(),
            contract_address: "0x0000000000000000000000000000000000000000".into(),
            payment_address: "0x0000000000000000000000000000000000000000".into(),
            category: ProjectCategory::Misc,
            funding_goal: 100000000000000000000i128.into(),
            start_time: (Utc::now() + Duration::days(1)).timestamp(),
            duration: Duration::days(45).num_seconds(),
            total_pledged: 0.into(),
            backer_count: 0,
            base_currency: PaymentCurrency::Ethereum,
            rewards_order: vec![],
            assets_order: vec![],
            status: ProjectStatus::Prelaunch,
            blockchain_status: BlockchainStatus::None,
            transaction_hash: None,
            created_at: Utc::now() - Duration::days(10),
            updated_at: Utc::now(),
        },
        ProjectEntityDbProps {
            id: Uuid::from_str("bbe3791a-96af-4de6-8796-5d2f5c8ca144").unwrap(),
            user_id: Uuid::from_str("276168ed-9228-4d6b-aec2-ed53bb7c1901").unwrap(),
            name: "Dogpedia".into(),
            description: "Finally, a website that works for pets. Tired of explaining everything to your fluffy buddy? Dogpedia will change your life.\n\nThis project is for demonstration purposes only, backing is disabled.".into(),
            blurb: "Wikipedia for Dogs".into(),
            contract_address: "0x0000000000000000000000000000000000000000".into(),
            payment_address: "0x0000000000000000000000000000000000000000".into(),
            category: ProjectCategory::Digital,
            funding_goal: 1000000000000000000i128.into(),
            start_time: (Utc::now() + Duration::days(1)).timestamp(),
            duration: Duration::days(45).num_seconds(),
            total_pledged: 0.into(),
            backer_count: 0,
            base_currency: PaymentCurrency::Ethereum,
            rewards_order: vec![],
            assets_order: vec![],
            status: ProjectStatus::Approved,
            blockchain_status: BlockchainStatus::None,
            transaction_hash: None,
            created_at: Utc::now() - Duration::days(15),
            updated_at: Utc::now(),
        },
        ProjectEntityDbProps {
            id: Uuid::from_str("f20c8b1a-16cc-4f2b-bb85-00b6fa00f4e9").unwrap(),
            user_id: Uuid::from_str("276168ed-9228-4d6b-aec2-ed53bb7c1901").unwrap(),
            name: "Some Thing".into(),
            description: "A cool thing I guess.".into(),
            blurb: "Low Effort Post".into(),
            contract_address: "0x0000000000000000000000000000000000000000".into(),
            payment_address: "0x0000000000000000000000000000000000000000".into(),
            category: ProjectCategory::Digital,
            funding_goal: 50000000000000000000i128.into(),
            start_time: (Utc::now() + Duration::days(1)).timestamp(),
            duration: Duration::days(45).num_seconds(),
            total_pledged: 0.into(),
            backer_count: 0,
            base_currency: PaymentCurrency::Ethereum,
            rewards_order: vec![],
            assets_order: vec![],
            status: ProjectStatus::Denied,
            blockchain_status: BlockchainStatus::None,
            transaction_hash: None,
            created_at: Utc::now() - Duration::days(20),
            updated_at: Utc::now(),
        },
        ProjectEntityDbProps {
            id: Uuid::from_str("0c9d3f3e-8027-4582-b573-99b2d6f87ebc").unwrap(),
            user_id: Uuid::from_str("00e8ee0b-843b-43e7-84c1-6d7a64cd5cfd").unwrap(),
            name: "Good Boot".into(),
            description: "We make custom designer boots for men, women, and children! Back now to get your own one of a kind footwear. Lifetime guarantee!\n\nThis project is for demonstration purposes only, backing is disabled.".into(),
            blurb: "Single run designer boots".into(),
            contract_address: "0x0000000000000000000000000000000000000000".into(),
            payment_address: "0x0000000000000000000000000000000000000000".into(),
            category: ProjectCategory::Fashion,
            funding_goal: 50000000000000000000i128.into(),
            start_time: (Utc::now() + Duration::days(1)).timestamp(),
            duration: Duration::days(60).num_seconds(),
            total_pledged: 0.into(),
            backer_count: 0,
            base_currency: PaymentCurrency::Ethereum,
            rewards_order: vec![],
            assets_order: vec![],
            status: ProjectStatus::Prelaunch,
            blockchain_status: BlockchainStatus::None,
            transaction_hash: None,
            created_at: Utc::now() - Duration::days(25),
            updated_at: Utc::now(),
        },
        ProjectEntityDbProps {
            id: Uuid::from_str("a9b3146a-1bb7-49fc-b4be-c25e103d899c").unwrap(),
            user_id: Uuid::from_str("00e8ee0b-843b-43e7-84c1-6d7a64cd5cfd").unwrap(),
            name: "Modern Classic Album".into(),
            description: "We're a new band from Saskatchewan making avant garde premium grass-fed steampunk rock for humans. Please give us money for our eponymous album.\n\nThis project is for demonstration purposes only, backing is disabled.".into(),
            blurb: "Echoes of Yesterday: A Modern Classic Rock Revival".into(),
            contract_address: "0x0000000000000000000000000000000000000000".into(),
            payment_address: "0x0000000000000000000000000000000000000000".into(),
            category: ProjectCategory::Fashion,
            funding_goal: 50000000000000000000i128.into(),
            start_time: (Utc::now() + Duration::days(1)).timestamp(),
            duration: Duration::days(60).num_seconds(),
            total_pledged: 0.into(),
            backer_count: 0,
            base_currency: PaymentCurrency::Ethereum,
            rewards_order: vec![],
            assets_order: vec![],
            status: ProjectStatus::Complete,
            blockchain_status: BlockchainStatus::None,
            transaction_hash: None,
            created_at: Utc::now() - Duration::days(30),
            updated_at: Utc::now(),
        },
        ProjectEntityDbProps {
            id: Uuid::from_str("3e42e273-546d-4989-a97c-f6eb173e8450").unwrap(),
            user_id: Uuid::from_str("00e8ee0b-843b-43e7-84c1-6d7a64cd5cfd").unwrap(),
            name: "Vintage Player".into(),
            description: "Rediscover Vinyl - Dive into the warm, rich sounds of vinyl with our elegantly designed, vintage-inspired record player. Perfect for audiophiles and casual listeners alike, this turntable is a bridge between classic aesthetics and contemporary functionality.\n\nThis project is for demonstration purposes only, backing is disabled.".into(),
            blurb: "Revive the Classics: Vintage-Inspired Record Player with Modern Tech".into(),
            contract_address: "0x0000000000000000000000000000000000000000".into(),
            payment_address: "0x0000000000000000000000000000000000000000".into(),
            category: ProjectCategory::Music,
            funding_goal: 50000000000000000000i128.into(),
            start_time: (Utc::now() - Duration::days(1)).timestamp(),
            duration: Duration::days(60).num_seconds(),
            total_pledged: 100000000000000000i128.into(),
            backer_count: 1,
            base_currency: PaymentCurrency::Ethereum,
            rewards_order: vec![],
            assets_order: vec![],
            status: ProjectStatus::Active,
            blockchain_status: BlockchainStatus::None,
            transaction_hash: None,
            created_at: Utc::now() - Duration::days(35),
            updated_at: Utc::now(),
        },
        ProjectEntityDbProps {
            id: Uuid::from_str("9e8f0c6f-1edf-4d68-a096-7a2bb4625c98").unwrap(),
            user_id: Uuid::from_str("00e8ee0b-843b-43e7-84c1-6d7a64cd5cfd").unwrap(),
            name: "Repair Shop".into(),
            description: "Join Our Mission - At Fix-It-Right, we believe in the power of repair to reduce waste and empower communities. Our shop specializes in fixing everything from electronics to furniture, breathing new life into items and reducing the need for replacements.\n\nThis project is for demonstration purposes only, backing is disabled.".into(),
            blurb: "Fix-It-Right: Empowering Community Through Repair".into(),
            contract_address: "0x0000000000000000000000000000000000000000".into(),
            payment_address: "0x0000000000000000000000000000000000000000".into(),
            category: ProjectCategory::Misc,
            funding_goal: 10000000000000000000i128.into(),
            start_time: (Utc::now() + Duration::days(1)).timestamp(),
            duration: Duration::days(60).num_seconds(),
            total_pledged: 12500000000000000000i128.into(),
            backer_count: 0,
            base_currency: PaymentCurrency::Ethereum,
            rewards_order: vec![],
            assets_order: vec![],
            status: ProjectStatus::Active,
            blockchain_status: BlockchainStatus::None,
            transaction_hash: None,
            created_at: Utc::now() - Duration::days(40),
            updated_at: Utc::now(),
        },
        ProjectEntityDbProps {
            id: Uuid::from_str("fa4d21c2-16a3-46cf-8162-98f4a82b59aa").unwrap(),
            user_id: Uuid::from_str("00e8ee0b-843b-43e7-84c1-6d7a64cd5cfd").unwrap(),
            name: "Hi-Fi Sphere".into(),
            description: "Elevate Your Listening - Introducing SoundSphere, the next generation of hi-fi music players. Designed as a sleek, elegant sphere, it offers unparalleled sound quality and a stunning visual addition to any space.\n\nThis project is for demonstration purposes only, backing is disabled.".into(),
            blurb: "SoundSphere: Revolutionize Your Music Experience".into(),
            contract_address: "0x0000000000000000000000000000000000000000".into(),
            payment_address: "0x0000000000000000000000000000000000000000".into(),
            category: ProjectCategory::Technology,
            funding_goal: 20000000000000000000i128.into(),
            start_time: (Utc::now() - Duration::days(2)).timestamp(),
            duration: Duration::days(60).num_seconds(),
            total_pledged: 28000000000000000000i128.into(),
            backer_count: 97,
            base_currency: PaymentCurrency::Ethereum,
            rewards_order: vec!["f99aa7f1-fc8a-4073-aff7-beaa1bbdfb3a".into(), "28046fdd-9e47-441d-8142-8f556e5d825c".into()],
            assets_order: vec![],
            status: ProjectStatus::Complete,
            blockchain_status: BlockchainStatus::None,
            transaction_hash: None,
            created_at: Utc::now() - Duration::days(45),
            updated_at: Utc::now(),
        },
        ProjectEntityDbProps {
            id: Uuid::from_str("00df0e23-22af-4959-874c-aca385b54eed").unwrap(),
            user_id: Uuid::from_str("00e8ee0b-843b-43e7-84c1-6d7a64cd5cfd").unwrap(),
            name: "Community Event".into(),
            description: "Join us in bringing the annual Community Festival to life! This event is all about celebrating our local culture, arts, and the spirit of togetherness. Our festival features live music, art installations, local cuisine, and activities for all ages, creating a vibrant tapestry of our community's talents and interests.\n\nThis project is for demonstration purposes only, backing is disabled.".into(),
            blurb: "Celebrate Together: Community Festival Fundraiser".into(),
            contract_address: "0x0000000000000000000000000000000000000000".into(),
            payment_address: "0x0000000000000000000000000000000000000000".into(),
            category: ProjectCategory::Misc,
            funding_goal: 9000000000000000000i128.into(),
            start_time: (Utc::now() + Duration::days(1)).timestamp(),
            duration: Duration::days(60).num_seconds(),
            total_pledged: 12500000000000000000i128.into(),
            backer_count: 0,
            base_currency: PaymentCurrency::Ethereum,
            rewards_order: vec![],
            assets_order: vec!["873aa935-87e1-4e4c-8a7c-a7d8f083ed08".into()],
            status: ProjectStatus::Active,
            blockchain_status: BlockchainStatus::None,
            transaction_hash: None,
            created_at: Utc::now() - Duration::days(50),
            updated_at: Utc::now(),
        },
    ];

    Ok(bulk_insert(&db, table, &data).await?)
}
