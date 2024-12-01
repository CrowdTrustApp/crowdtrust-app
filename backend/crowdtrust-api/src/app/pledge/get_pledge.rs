use axum::{
    extract::{Path, State},
    Extension, Json,
};
use lib_api::error::api_error::ApiError;
use lib_types::{
    dto::pledge::pledge_view_model::{to_api_response_relations, GetPledgeViewModel},
    shared::user::RequestUser,
};
use uuid::Uuid;

use crate::{
    api_context::ApiContext,
    app::helpers::{not_found_or_internal, verify_admin_or_user},
};

pub async fn get_pledge(
    Path(id): Path<Uuid>,
    State(context): State<ApiContext>,
    Extension(request_user): Extension<RequestUser>,
) -> Result<Json<GetPledgeViewModel>, ApiError> {
    // Get pledge from DB
    let pledge = context
        .repo
        .pledge
        .get_pledge_relations_by_id(id)
        .await
        .map_err(not_found_or_internal)?;

    verify_admin_or_user(&request_user, pledge.user_id.to_string())?;

    Ok(Json(to_api_response_relations(pledge)))
}
