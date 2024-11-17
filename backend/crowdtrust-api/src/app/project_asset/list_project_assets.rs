use axum::{
    extract::{Query, State},
    Extension, Json,
};
use lib_api::error::{api_error::ApiError, helpers::check_bad_form};
use lib_types::{
    dto::project_asset::{
        list_project_assets_dto::{ListProjectAssetsQuery, ListProjectAssetsResponse},
        project_asset_viewmodel::to_api_response,
    },
    shared::user::{RequestUser, UserType},
};
use validator::Validate;

use crate::{api_context::ApiContext, app::helpers::verify_user};

pub async fn list_project_assets(
    State(context): State<ApiContext>,
    Extension(request_user): Extension<RequestUser>,
    Query(query): Query<ListProjectAssetsQuery>,
) -> Result<Json<ListProjectAssetsResponse>, ApiError> {
    check_bad_form(query.validate())?;

    // Check user role to determine the filters to apply
    let q = make_list_project_assets_query(&request_user, query)?;

    let result = context
        .repo
        .project_asset
        .list_project_assets(q)
        .await
        .map_err(|e| {
            ApiError::internal_error().message(format!("Failed to list project assets: {}", e))
        })?;

    let results = result
        .results
        .into_iter()
        .map(|r| to_api_response(r))
        .collect();
    Ok(Json(ListProjectAssetsResponse {
        results,
        total_usage: result.total_usage,
        total: result.total,
    }))
}

fn make_list_project_assets_query(
    request_user: &RequestUser,
    query: ListProjectAssetsQuery,
) -> Result<ListProjectAssetsQuery, ApiError> {
    match request_user.user_type {
        UserType::Admin => Ok(query),
        UserType::User => {
            let user_id = verify_user(request_user, query.user_id.clone())?;

            Ok(ListProjectAssetsQuery {
                user_id: Some(user_id),
                ..query
            })
        }
        _ => Err(ApiError::unauthorized()),
    }
}
