use axum::{extract::State, http::StatusCode, Extension, Json};

use chrono::{Duration, Utc};
use lib_api::{
    error::{api_error::ApiError, helpers::check_bad_form},
    util::{conversion::str_to_uuid, json_extractor::CtJson},
};
use lib_types::{
    dto::project_asset::create_project_asset_dto::{
        to_api_response, CreateProjectAssetDto, CreateProjectAssetResponse,
    },
    shared::{asset::AssetState, user::RequestUser},
};
use validator::Validate;

use crate::{
    api_context::ApiContext, app::helpers::verify_admin_or_user,
    db::project_asset_repo::ProjectAssetEntityProps,
};

pub async fn create_project_asset(
    State(context): State<ApiContext>,
    Extension(request_user): Extension<RequestUser>,
    CtJson(dto): CtJson<CreateProjectAssetDto>,
) -> Result<(StatusCode, Json<CreateProjectAssetResponse>), ApiError> {
    check_bad_form(dto.validate())?;

    let user_id = request_user.user_id.ok_or(ApiError::forbidden())?;

    let project_id = str_to_uuid(&dto.project_id)?;

    let project = context
        .repo
        .project
        .get_project_by_id(project_id.clone())
        .await
        .map_err(|_| ApiError::bad_request().message("Project does not exist"))?;

    // Check if the requester is the owner of the project or an admin
    verify_admin_or_user(&request_user, project.user_id.to_string())?;

    let content_type = dto.content_type.to_string();

    let expires_seconds: i64 = 600;
    // Remove query/signature for storage
    let entity_props = ProjectAssetEntityProps {
        size: dto.content_size,
        content_type: content_type.clone(),
        state: AssetState::Created,
        user_id,
        project_id,
        upload_expires_at: Utc::now() + Duration::seconds(expires_seconds),
    };

    let project_asset = context
        .repo
        .project_asset
        .create_project_asset(entity_props)
        .await
        .map_err(|e| {
            ApiError::internal_error().message(format!("Failed to create project asset: {}", e))
        })?;

    let signed_url = context.s3_client.presign_put_project_asset(
        &project_asset.relative_url(),
        expires_seconds as u64,
        &content_type,
        dto.content_size,
    )?;

    let response = Json(to_api_response(project_asset, signed_url.to_string()));
    Ok((StatusCode::CREATED, response))
}
