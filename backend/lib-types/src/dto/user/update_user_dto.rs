use serde::Deserialize;
use validator::Validate;

use crate::shared::user::{UserStatus, UserType};

use crate::type_util::REGEX_ETH_ADDRESS;

#[derive(Deserialize, Validate)]
#[serde(deny_unknown_fields)]
pub struct UpdateUserDto {
    #[validate(email)]
    pub email: Option<String>,
    #[validate(length(min = 2, max = 20))]
    pub name: Option<String>,
    #[validate(length(min = 0, max = 400))]
    pub description: Option<String>,
    #[validate(length(min = 4, max = 50))]
    pub link: Option<String>,
    #[validate(length(min = 2, max = 50))]
    pub location: Option<String>,
    #[validate(length(min = 8, max = 50))]
    pub old_password: Option<String>,
    #[validate(length(min = 8, max = 50))]
    pub new_password: Option<String>,
    #[validate(regex(path = "*REGEX_ETH_ADDRESS"))]
    pub eth_address: Option<String>,
    #[validate(length(min = 50, max = 300))]
    pub eth_address_signature: Option<String>,
    pub user_type: Option<UserType>,
    pub user_status: Option<UserStatus>,
}