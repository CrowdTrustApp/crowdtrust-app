use serde::{Deserialize, Serialize};
use uuid::Uuid;
use validator::Validate;

use crate::type_util::REGEX_POSITIVE_NUMBER;

#[derive(Deserialize, Validate)]
#[serde(deny_unknown_fields)]
pub struct CreateRewardDto {
    #[validate(length(min = 3, max = 50))]
    pub name: String,
    #[validate(length(min = 10, max = 300))]
    pub description: String,
    #[validate(length(min = 0, max = 100), regex(path = "*REGEX_POSITIVE_NUMBER"))]
    pub price: String,
    pub delivery_time: i64,
    #[validate(range(min = 1, max = 1000000000))]
    pub backer_limit: i64,
}

#[derive(Serialize)]
pub struct CreateRewardResponse {
    pub id: Uuid,
}
