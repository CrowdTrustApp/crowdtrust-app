use crate::{
    shared::project::{ProjectCategory, ProjectStatus},
    type_util::REGEX_UUID,
};
use serde::{Deserialize, Serialize};
use strum::{Display, EnumString};
use validator::Validate;

use crate::dto::sort_direction::SortDirection;

use super::project_view_model::ProjectViewModel;

#[derive(Debug, Serialize, Deserialize, Clone, Copy, PartialEq, Eq, EnumString, Display)]
#[serde(rename_all = "snake_case")]
pub enum ProjectSortColumn {
    TotalPledged,
    FundingGoal,
    CreatedAt,
    UpdatedAt,
}

#[derive(Debug, Deserialize, Validate)]
#[serde(deny_unknown_fields)]
pub struct ListProjectsQuery {
    #[serde(default = "default_from")]
    #[validate(range(min = 1))]
    pub from: i32,
    #[serde(default = "default_to")]
    #[validate(range(min = 1))]
    pub to: i32,
    pub statuses: Option<Vec<ProjectStatus>>,
    pub categories: Option<Vec<ProjectCategory>>,
    #[validate(regex(path = "*REGEX_UUID"))]
    pub user_id: Option<String>,
    pub column: Option<ProjectSortColumn>,
    pub direction: Option<SortDirection>,
}

fn default_from() -> i32 {
    1
}

fn default_to() -> i32 {
    20
}

#[derive(Serialize)]
pub struct ListProjectsResponse {
    pub total: i64,
    pub results: Vec<ProjectViewModel>,
}
