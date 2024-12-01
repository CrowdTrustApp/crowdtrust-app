use crate::type_util::REGEX_UUID;
use serde::{Deserialize, Serialize};
use strum::{Display, EnumString};
use validator::Validate;

use crate::dto::sort_direction::SortDirection;

use super::pledge_view_model::GetPledgeViewModel;

#[derive(Debug, Serialize, Deserialize, Clone, Copy, PartialEq, Eq, EnumString, Display)]
#[serde(rename_all = "snake_case")]
pub enum PledgeSortColumn {
    CreatedAt,
    UpdatedAt,
}

#[derive(Debug, Deserialize, Validate)]
#[serde(deny_unknown_fields)]
pub struct ListPledgesQuery {
    #[serde(default = "default_from")]
    #[validate(range(min = 1))]
    pub from: i32,
    #[serde(default = "default_to")]
    #[validate(range(min = 1))]
    pub to: i32,
    #[validate(regex(path = "*REGEX_UUID"))]
    pub user_id: Option<String>,
    #[validate(regex(path = "*REGEX_UUID"))]
    pub project_id: Option<String>,
    pub column: Option<PledgeSortColumn>,
    pub direction: Option<SortDirection>,
}

fn default_from() -> i32 {
    1
}

fn default_to() -> i32 {
    20
}

#[derive(Serialize)]
pub struct ListPledgesResponse {
    pub total: i64,
    pub results: Vec<GetPledgeViewModel>,
}
