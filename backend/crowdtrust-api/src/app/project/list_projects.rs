use axum::{extract::State, Extension, Json};
use lib_api::{
    error::{api_error::ApiError, helpers::check_bad_form},
    util::conversion::str_opt_to_uuid,
};
use lib_types::{
    dto::project::{
        list_projects_dto::{ListProjectsQuery, ListProjectsResponse},
        project_view_model::{to_api_response, ProjectViewModel},
    },
    shared::{
        api_error::ApiErrorCode,
        project::ProjectStatus,
        user::{RequestUser, UserType},
    },
};
use validator::Validate;

use crate::{api_context::ApiContext, app::Qs};

pub async fn list_projects(
    State(context): State<ApiContext>,
    Qs(query): Qs<ListProjectsQuery>,
    Extension(request_user): Extension<RequestUser>,
) -> Result<Json<ListProjectsResponse>, ApiError> {
    check_bad_form(query.validate())?;

    let default_statuses = vec![
        ProjectStatus::Prelaunch,
        ProjectStatus::Active,
        ProjectStatus::Complete,
    ];

    let statuses = if request_user.user_type == UserType::Admin {
        query.statuses
    } else {
        // If the user filters by their own ID, filter by any status
        if query.user_id.is_some() && str_opt_to_uuid(&query.user_id) == request_user.user_id {
            query.statuses
        } else if let Some(statuses) = query.statuses.clone() {
            let restricted_status = statuses.iter().find(|s| {
                matches!(
                    s,
                    ProjectStatus::Initial
                        | ProjectStatus::Review
                        | ProjectStatus::Approved
                        | ProjectStatus::Denied
                )
            });
            if let Some(restricted) = restricted_status {
                return Err(ApiError::bad_request()
                    .code(ApiErrorCode::RestrictedStatus)
                    .message(format!("Cannot filter by status: {}", restricted)));
            } else if statuses.len() == 0 {
                Some(default_statuses)
            } else {
                query.statuses
            }
        } else {
            Some(default_statuses)
        }
    };
    let validated_query = ListProjectsQuery {
        from: query.from,
        to: query.to,
        statuses,
        categories: query.categories,
        user_id: query.user_id,
        column: query.column,
        direction: query.direction,
    };

    let projects = context
        .repo
        .project
        .list_projects(validated_query)
        .await
        .map_err(|e| {
            ApiError::internal_error().message(format!("Failed to list projects: {}", e))
        })?;

    let view_models: Vec<ProjectViewModel> = projects
        .results
        .into_iter()
        .map(|projects| to_api_response(projects))
        .collect();

    Ok(Json(ListProjectsResponse {
        total: projects.total,
        results: view_models,
    }))
}
