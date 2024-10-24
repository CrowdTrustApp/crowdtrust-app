use crate::type_util::REGEX_ETH_ADDRESS;
use serde::{Deserialize, Serialize};
use validator::Validate;

#[derive(Debug, Deserialize, Validate)]
#[serde(deny_unknown_fields)]
pub struct LoginDto {
    #[validate(email)]
    pub email: Option<String>,
    #[validate(length(min = 8, max = 50))]
    pub password: Option<String>,
    #[validate(regex(path = "*REGEX_ETH_ADDRESS"))]
    pub eth_address: Option<String>,
    #[validate(length(min = 50, max = 300))]
    pub eth_address_signature: Option<String>,
}

#[derive(Serialize)]
pub struct LoginResponse {
    pub auth_token: String,
}
