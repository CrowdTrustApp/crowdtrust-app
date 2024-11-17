use serde::{Deserialize, Serialize};
use strum::{Display, EnumString};
use validator::Validate;

use crate::{
    dto::sort_direction::SortDirection,
    shared::asset::{AssetContentType, AssetState},
    type_util::REGEX_UUID,
};

use super::project_asset_viewmodel::ProjectAssetViewModel;

#[derive(Debug, Serialize, Deserialize, Clone, Copy, PartialEq, Eq, EnumString, Display)]
#[serde(rename_all = "snake_case")]
pub enum ProjectAssetSortColumn {
    Size,
    CreatedAt,
    UpdatedAt,
}

#[derive(Deserialize, Validate)]
#[serde(deny_unknown_fields)]
pub struct ListProjectAssetsQuery {
    #[validate(regex(path = "*REGEX_UUID"))]
    pub user_id: Option<String>,
    #[validate(regex(path = "*REGEX_UUID"))]
    pub project_id: Option<String>,
    pub content_type: Option<AssetContentType>,
    pub state: Option<AssetState>,
    #[serde(default = "default_from")]
    #[validate(range(min = 1))]
    pub from: i32,
    #[serde(default = "default_to")]
    #[validate(range(min = 1))]
    pub to: i32,
    pub column: Option<ProjectAssetSortColumn>,
    pub direction: Option<SortDirection>,
}

impl ListProjectAssetsQuery {
    pub fn new() -> ListProjectAssetsQuery {
        Self {
            user_id: None,
            project_id: None,
            content_type: None,
            state: None,
            column: None,
            from: default_from(),
            to: default_to(),
            direction: None,
        }
    }
    pub fn project_id(mut self, project_id: String) -> ListProjectAssetsQuery {
        self.project_id = Some(project_id);
        self
    }
}

fn default_from() -> i32 {
    1
}

fn default_to() -> i32 {
    25
}

#[derive(Serialize)]
pub struct ListProjectAssetsResponse {
    pub total: i64,
    pub total_usage: u64,
    pub results: Vec<ProjectAssetViewModel>,
}
