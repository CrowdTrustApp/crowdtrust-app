use serde::Serialize;

#[derive(Serialize)]
pub struct VerifyRewardAssetResponse {
    pub verified: bool,
}
