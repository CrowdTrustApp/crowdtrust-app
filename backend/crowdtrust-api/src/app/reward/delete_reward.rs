use axum::{
    extract::{Path, State},
    Extension,
};

use lib_api::error::api_error::ApiError;
use lib_types::shared::user::RequestUser;
use uuid::Uuid;

use crate::{
    api_context::ApiContext,
    app::{helpers::verify_admin_or_user, project::helpers::verify_project_exist},
};

use super::helpers::verify_reward_exist;

pub async fn delete_reward(
    Path(reward_id): Path<Uuid>,
    Extension(request_user): Extension<RequestUser>,
    State(context): State<ApiContext>,
) -> Result<(), ApiError> {
    // Check if the reward exists in the database
    let reward = verify_reward_exist(&context, reward_id).await?;
    let project = verify_project_exist(&context, reward.project_id).await?;

    // Check if the requester is the owner of the reward or an admin
    verify_admin_or_user(&request_user, project.user_id.to_string())?;

    // Remove the entry from the database
    context
        .repo
        .reward
        .delete_reward_by_id(reward_id)
        .await
        .map_err(|e| {
            ApiError::internal_error().message(format!("Failed to delete reward: {}", e))
        })?;

    Ok(())
}
