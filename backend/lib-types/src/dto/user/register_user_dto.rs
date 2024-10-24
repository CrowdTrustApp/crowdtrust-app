use serde::{Deserialize, Serialize};
use uuid::Uuid;
use validator::Validate;

use crate::type_util::REGEX_ETH_ADDRESS;

#[derive(Deserialize, Validate)]
#[serde(deny_unknown_fields)]
pub struct RegisterUserDto {
    #[validate(email)]
    pub email: String,
    #[validate(length(min = 8, max = 50))]
    pub password: String,
    #[validate(regex(path = "*REGEX_ETH_ADDRESS"))]
    pub eth_address: String,
    #[validate(length(min = 50, max = 300))]
    pub eth_address_signature: String,
}

#[derive(Serialize)]
pub struct RegisterUserResponse {
    pub id: Uuid,
}
