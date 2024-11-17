use serde::Serialize;

#[derive(Serialize)]
pub struct VerifyProjectAssetResponse {
    pub verified: bool,
}
