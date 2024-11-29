use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use uuid::Uuid;
use validator::Validate;

use crate::type_util::REGEX_UUID;

#[derive(Deserialize, Validate)]
pub struct PledgeItemDto {
    #[validate(regex(path = "*REGEX_UUID"))]
    pub reward_id: String,
    #[validate(range(min = 1, max = 1000))]
    pub quantity: i32,
}

#[derive(Deserialize, Validate)]
#[serde(deny_unknown_fields)]
pub struct BackProjectDto {
    #[validate(nested)]
    pub rewards: Vec<PledgeItemDto>,
}

#[derive(Serialize)]
pub struct BackProjectResponse {
    pub id: Uuid,
    pub project_id: Uuid,
    pub user_id: Uuid,
    pub comment: String,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}
