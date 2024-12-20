use axum::{
    async_trait,
    extract::FromRequestParts,
    http::{request::Parts, StatusCode},
};

pub mod app_router;
pub mod auth;
pub mod health;
pub mod helpers;
pub mod pledge;
pub mod project;
pub mod project_asset;
pub mod reward;
pub mod reward_asset;
pub mod user;

// Workaround for query string arrays
// https://github.com/tokio-rs/axum/issues/434#issuecomment-954898159
pub struct Qs<T>(pub T);

#[async_trait]
impl<S, T> FromRequestParts<S> for Qs<T>
where
    S: Send + Sync,
    T: serde::de::DeserializeOwned,
{
    type Rejection = (StatusCode, &'static str);

    async fn from_request_parts(parts: &mut Parts, _state: &S) -> Result<Self, Self::Rejection> {
        let query = parts.uri.query().unwrap_or("");
        if let Ok(parsed_data) = serde_qs::from_str(query) {
            Ok(Self(parsed_data))
        } else {
            println!("Failed to parse query string");
            Err((StatusCode::BAD_REQUEST, "Failed to parse query string"))
        }
    }
}
