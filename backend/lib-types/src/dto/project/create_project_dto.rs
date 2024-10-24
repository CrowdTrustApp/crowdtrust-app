use serde::{Deserialize, Serialize};
use uuid::Uuid;
use validator::Validate;

use crate::{shared::project::ProjectCategory, type_util::REGEX_POSITIVE_NUMBER};

#[derive(Deserialize, Validate)]
#[serde(deny_unknown_fields)]
pub struct CreateProjectDto {
    #[validate(length(min = 3, max = 50))]
    pub name: String,
    #[validate(length(min = 10, max = 10000))]
    pub description: String,
    #[validate(length(min = 5, max = 200))]
    pub blurb: String,
    pub category: ProjectCategory,
    #[validate(length(min = 0, max = 100), regex(path = "*REGEX_POSITIVE_NUMBER"))]
    pub funding_goal: String,
    pub start_time: i64,
    #[validate(range(min = 86400, max = 7776000))]
    pub duration: i64,
}

#[derive(Serialize)]
pub struct CreateProjectResponse {
    pub id: Uuid,
}
