use axum::extract::{Path, State};
use axum::http::StatusCode;
use axum::{Extension, Json};
use axum_macros::debug_handler;
use bigdecimal::BigDecimal;
use lib_api::db::db_error::DbError;
use lib_api::db::util::commit_or_rollback;
use lib_api::error::api_error::ApiError;
use lib_api::error::helpers::check_bad_form;
use lib_api::util::conversion::str_to_uuid;
use lib_api::util::json_extractor::CtJson;
use lib_types::dto::project::back_project_dto::{BackProjectDto, BackProjectResponse};
use lib_types::entity::pledge_entity::PledgeEntity;
use lib_types::entity::reward_entity::RewardEntity;
use lib_types::shared::api_error::ApiErrorCode;
use lib_types::shared::project::{PaymentCurrency, ProjectStatus};
use lib_types::shared::user::RequestUser;
use uuid::Uuid;
use validator::Validate;

use crate::api_context::ApiContext;
use crate::app::helpers::get_request_user;
use crate::db::pledge_repo::{PledgeCreateProps, PledgeItemCreateProps};
use crate::db::project_repo::ProjectUpdateProps;
use crate::db::reward_repo::RewardUpdateProps;

use super::helpers::verify_project_exist_relations;

fn to_api_response(result: PledgeEntity) -> Json<BackProjectResponse> {
    return Json(BackProjectResponse {
        id: result.id,
        project_id: result.project_id,
        user_id: result.user_id,
        comment: result.comment,
        created_at: result.created_at,
        updated_at: result.updated_at,
    });
}

fn reward_price(rewards: &Vec<RewardEntity>, reward_id: &str) -> Result<BigDecimal, ApiError> {
    rewards
        .iter()
        .find(|r| &r.id.to_string() == reward_id)
        .and_then(|r| Some(r.price.clone()))
        .ok_or(ApiError::bad_request().code(ApiErrorCode::UnknownReward))
}

fn err_fail(e: DbError) -> ApiError {
    ApiError::internal_error().message(format!("Failed to back project: {}", e))
}

#[debug_handler]
pub async fn back_project(
    Path(project_id): Path<Uuid>,
    State(context): State<ApiContext>,
    Extension(request_user): Extension<RequestUser>,
    CtJson(dto): CtJson<BackProjectDto>,
) -> Result<(StatusCode, Json<BackProjectResponse>), ApiError> {
    check_bad_form(dto.validate())?;
    let user = get_request_user(&context, &request_user).await?;

    let project = verify_project_exist_relations(&context, project_id).await?;

    // Verify project active
    if project.status != ProjectStatus::Active {
        return Err(ApiError::bad_request()
            .code(ApiErrorCode::ProjectInactive)
            .message("Cannot back inactive project"));
    }
    let mut pledge_items: Vec<PledgeItemCreateProps> = vec![];
    for reward in dto.rewards.into_iter() {
        pledge_items.push(PledgeItemCreateProps {
            reward_id: str_to_uuid(&reward.reward_id)?,
            quantity: reward.quantity,
            paid_price: reward_price(&project.rewards, &reward.reward_id)?,
            paid_currency: PaymentCurrency::Ethereum,
        })
    }
    let pledged: BigDecimal = pledge_items
        .iter()
        .map(|item| item.paid_price.clone() * item.quantity)
        .sum();

    let props = PledgeCreateProps {
        user_id: user.id,
        project_id: project.id.clone(),
        pledge_items: pledge_items.clone(),
    };

    let mut tx = context.repo.start_transaction().await?;

    let pledge_result = context
        .repo
        .pledge
        .back_project(&mut tx, props)
        .await
        .map_err(err_fail)?;

    context
        .repo
        .project
        .update_project_tx(
            &mut tx,
            project_id,
            ProjectUpdateProps::backed(project.backer_count + 1, project.total_pledged + pledged),
        )
        .await
        .map_err(err_fail)?;

    for pledge_item in pledge_items.into_iter() {
        let count = project
            .rewards
            .iter()
            .find(|r| r.id == pledge_item.reward_id)
            .ok_or(
                ApiError::bad_request()
                    .code(ApiErrorCode::UnknownReward)
                    .message("Pledge reward not found"),
            )?
            .backer_count;
        context
            .repo
            .reward
            .update_reward(
                pledge_item.reward_id,
                RewardUpdateProps::backer_count(count + pledge_item.quantity),
            )
            .await
            .map_err(err_fail)?;
    }

    commit_or_rollback(tx, Ok(())).await?;

    Ok((StatusCode::CREATED, to_api_response(pledge_result)))
}
