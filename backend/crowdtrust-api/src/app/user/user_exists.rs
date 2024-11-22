use axum::{
    extract::{Query, State},
    Json,
};
use lib_api::error::{api_error::ApiError, helpers::check_bad_form};
use lib_types::dto::user::user_exists_dto::{UserExistsQuery, UserExistsResponse};
use validator::Validate;

use crate::api_context::ApiContext;

pub async fn user_exists(
    State(context): State<ApiContext>,
    Query(query): Query<UserExistsQuery>,
) -> Result<Json<UserExistsResponse>, ApiError> {
    check_bad_form(query.validate())?;

    let user = context
        .repo
        .user
        .get_user_by_eth_address(query.eth_address.to_ascii_lowercase())
        .await;

    Ok(Json(UserExistsResponse {
        exists: user.is_ok(),
    }))
}
