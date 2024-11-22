use serde::Deserialize;
use validator::Validate;

use crate::{
    shared::project::{ProjectCategory, ProjectStatus},
    type_util::{REGEX_ETH_ADDRESS, REGEX_POSITIVE_NUMBER},
};

#[derive(Deserialize, Validate)]
#[serde(deny_unknown_fields)]
pub struct UpdateProjectDto {
    #[validate(length(min = 3, max = 50))]
    pub name: Option<String>,
    #[validate(length(min = 10, max = 10000))]
    pub description: Option<String>,
    #[validate(length(min = 5, max = 200))]
    pub blurb: Option<String>,
    #[validate(regex(path = "*REGEX_ETH_ADDRESS"))]
    pub payment_address: Option<String>,
    pub category: Option<ProjectCategory>,
    pub status: Option<ProjectStatus>,
    #[validate(length(min = 0, max = 100), regex(path = "*REGEX_POSITIVE_NUMBER"))]
    pub funding_goal: Option<String>,
    pub start_time: Option<i64>,
    #[validate(range(min = 86400, max = 7776000))]
    pub duration: Option<i64>,
    pub assets_order: Option<Vec<String>>,
    pub rewards_order: Option<Vec<String>>,
}
