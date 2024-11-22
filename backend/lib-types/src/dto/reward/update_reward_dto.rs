use serde::Deserialize;
use validator::Validate;

use crate::type_util::REGEX_POSITIVE_NUMBER;

#[derive(Deserialize, Validate)]
#[serde(deny_unknown_fields)]
pub struct UpdateRewardDto {
    #[validate(length(min = 3, max = 50))]
    pub name: Option<String>,
    #[validate(length(min = 10, max = 300))]
    pub description: Option<String>,
    #[validate(length(min = 0, max = 100), regex(path = "*REGEX_POSITIVE_NUMBER"))]
    pub price: Option<String>,
    pub delivery_time: Option<i64>,
    #[validate(range(min = 1, max = 1000000000))]
    pub backer_limit: Option<i64>,
    pub visible: Option<bool>,
}
