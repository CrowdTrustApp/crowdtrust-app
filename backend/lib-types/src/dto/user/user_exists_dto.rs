use serde::{Deserialize, Serialize};
use validator::Validate;

use crate::type_util::REGEX_ETH_ADDRESS;

#[derive(Deserialize, Validate)]
#[serde(deny_unknown_fields)]
pub struct UserExistsQuery {
    #[validate(regex(path = "*REGEX_ETH_ADDRESS"))]
    pub eth_address: String,
}

#[derive(Serialize)]
pub struct UserExistsResponse {
    pub exists: bool,
}
