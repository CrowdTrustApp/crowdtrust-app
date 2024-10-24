use serde::{Deserialize, Serialize};
use strum::{Display, EnumString};

pub static ACTIVE_PROJECT_CONTRACT: &str = "0x0000000000000000000000000000000000000000";

#[derive(
    Debug, Serialize, Deserialize, Clone, Copy, PartialEq, Eq, EnumString, Display, sqlx::Type,
)]
pub enum ProjectCategory {
    Technology,
    Digital,
    Fashion,
    Games,
    ArtDesign,
    Music,
    Misc,
}

#[derive(
    Debug, Serialize, Deserialize, Clone, Copy, PartialEq, Eq, EnumString, Display, sqlx::Type,
)]
pub enum BlockchainStatus {
    None,
    Pending,
    Error,
    Success,
}

#[derive(
    Debug, Serialize, Deserialize, Clone, Copy, PartialEq, Eq, EnumString, Display, sqlx::Type,
)]
pub enum ProjectStatus {
    Initial,
    Review,
    Approved,
    Denied,
    Prelaunch,
    Active,
    Complete,
}

#[derive(
    Debug, Serialize, Deserialize, Clone, Copy, PartialEq, Eq, EnumString, Display, sqlx::Type,
)]
pub enum PaymentCurrency {
    Ethereum,
    Tsc,
}
