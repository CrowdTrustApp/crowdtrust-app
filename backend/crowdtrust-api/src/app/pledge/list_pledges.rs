use axum::{extract::State, Extension, Json};
use lib_api::{
    db::util::option_string_to_uuid,
    error::{api_error::ApiError, helpers::check_bad_form},
};
use lib_types::{
    dto::pledge::{
        list_pledges_dto::{ListPledgesQuery, ListPledgesResponse},
        pledge_view_model::{to_api_response_relations, GetPledgeViewModel},
    },
    shared::user::{RequestUser, UserType},
};
use validator::Validate;

use crate::{api_context::ApiContext, app::Qs};

pub async fn list_pledges(
    State(context): State<ApiContext>,
    Qs(query): Qs<ListPledgesQuery>,
    Extension(request_user): Extension<RequestUser>,
) -> Result<Json<ListPledgesResponse>, ApiError> {
    check_bad_form(query.validate())?;

    // User must filter by their own ID
    if request_user.user_type == UserType::User {
        if query.user_id.is_none()
            || option_string_to_uuid(query.user_id.clone()) != request_user.user_id
        {
            return Err(ApiError::forbidden().message("User must filter by own ID"));
        }
    }

    let validated_query = ListPledgesQuery {
        from: query.from,
        to: query.to,
        user_id: query.user_id,
        project_id: query.project_id,
        column: query.column,
        direction: query.direction,
    };

    let pledges = context
        .repo
        .pledge
        .list_pledges(validated_query)
        .await
        .map_err(|e| {
            ApiError::internal_error().message(format!("Failed to list pledges: {}", e))
        })?;

    let view_models: Vec<GetPledgeViewModel> = pledges
        .results
        .into_iter()
        .map(|pledges| to_api_response_relations(pledges))
        .collect();

    Ok(Json(ListPledgesResponse {
        total: pledges.total,
        results: view_models,
    }))
}
