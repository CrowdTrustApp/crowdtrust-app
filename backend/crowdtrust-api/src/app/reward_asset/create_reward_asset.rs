use axum::{extract::State, http::StatusCode, Extension, Json};

use chrono::{Duration, Utc};
use lib_api::{
    error::{api_error::ApiError, helpers::check_bad_form},
    util::{conversion::str_to_uuid, json_extractor::CtJson},
};
use lib_types::{
    dto::{
        project_asset::create_project_asset_dto::CreateProjectAssetResponse,
        reward_asset::create_reward_asset_dto::{to_api_response, CreateRewardAssetDto},
    },
    shared::{asset::AssetState, user::RequestUser},
};
use validator::Validate;

use crate::{
    api_context::ApiContext,
    app::{
        helpers::verify_admin_or_user, project::helpers::verify_project_exist,
        reward::helpers::verify_reward_exist,
    },
    db::reward_asset_repo::RewardAssetEntityProps,
};

pub async fn create_reward_asset(
    State(context): State<ApiContext>,
    Extension(request_user): Extension<RequestUser>,
    CtJson(dto): CtJson<CreateRewardAssetDto>,
) -> Result<(StatusCode, Json<CreateProjectAssetResponse>), ApiError> {
    check_bad_form(dto.validate())?;

    let user_id = request_user.user_id.ok_or(ApiError::forbidden())?;

    let reward_id = str_to_uuid(&dto.reward_id)?;
    let reward = verify_reward_exist(&context, reward_id.clone()).await?;
    let project = verify_project_exist(&context, reward.project_id).await?;

    // Check if the requester is the owner of the reward or an admin
    verify_admin_or_user(&request_user, project.user_id.to_string())?;

    let content_type = dto.content_type.to_string();

    let expires_seconds: i64 = 600;
    // Remove query/signature for storage
    let entity_props = RewardAssetEntityProps {
        size: dto.content_size,
        content_type: content_type.clone(),
        state: AssetState::Created,
        user_id,
        reward_id,
        upload_expires_at: Utc::now() + Duration::seconds(expires_seconds),
    };

    let reward_asset = context
        .repo
        .reward_asset
        .create_reward_asset(entity_props)
        .await
        .map_err(|e| {
            ApiError::internal_error().message(format!("Failed to create reward asset: {}", e))
        })?;

    let signed_url = context.s3_client.presign_put_project_asset(
        &reward_asset.relative_url(project.id),
        expires_seconds as u64,
        &content_type,
        dto.content_size,
    )?;

    let response = Json(to_api_response(
        reward_asset,
        project.id,
        signed_url.to_string(),
    ));
    Ok((StatusCode::CREATED, response))
}
