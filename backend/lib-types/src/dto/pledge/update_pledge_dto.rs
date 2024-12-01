use serde::Deserialize;
use validator::Validate;

use crate::{shared::project::BlockchainStatus, type_util::REGEX_ETH_TX};

#[derive(Deserialize, Validate)]
#[serde(deny_unknown_fields)]
pub struct UpdatePledgeDto {
    #[validate(length(min = 0, max = 200))]
    pub comment: Option<String>,
    pub blockchain_status: Option<BlockchainStatus>,
    #[validate(regex(path = "*REGEX_ETH_TX"))]
    pub transaction_hash: Option<String>,
}
