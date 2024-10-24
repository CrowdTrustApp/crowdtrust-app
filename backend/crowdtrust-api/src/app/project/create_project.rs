use axum::extract::State;
use axum::http::StatusCode;
use axum::{Extension, Json};
use axum_macros::debug_handler;
use chrono::Utc;
use lib_api::db::db_error::DbError;
use lib_api::error::api_error::ApiError;
use lib_api::error::helpers::check_bad_form;
use lib_api::util::json_extractor::CtJson;
use lib_types::dto::project::create_project_dto::{CreateProjectDto, CreateProjectResponse};
use lib_types::entity::project_entity::ProjectEntity;
use lib_types::shared::api_error::ApiErrorCode;
use lib_types::shared::project::{
    BlockchainStatus, PaymentCurrency, ProjectStatus, ACTIVE_PROJECT_CONTRACT,
};
use lib_types::shared::user::RequestUser;
use validator::Validate;

use crate::api_context::ApiContext;
use crate::app::helpers::{get_request_user, str_to_bigdecimal};
use crate::db::project_repo::ProjectCreateProps;

fn to_api_response(result: ProjectEntity) -> Json<CreateProjectResponse> {
    return Json(CreateProjectResponse { id: result.id });
}

#[debug_handler]
pub async fn create_project(
    State(context): State<ApiContext>,
    Extension(request_user): Extension<RequestUser>,
    CtJson(dto): CtJson<CreateProjectDto>,
) -> Result<(StatusCode, Json<CreateProjectResponse>), ApiError> {
    check_bad_form(dto.validate())?;
    let user = get_request_user(&context, &request_user).await?;

    // Verify start_time is after now
    if dto.start_time < Utc::now().timestamp() {
        return Err(ApiError::bad_request()
            .code(ApiErrorCode::ProjectStart)
            .message("Start time must be after current time"));
    }

    let props = ProjectCreateProps {
        user_id: user.id,
        name: dto.name,
        description: dto.description,
        blurb: dto.blurb,
        contract_address: ACTIVE_PROJECT_CONTRACT.into(),
        payment_address: user.eth_address,
        category: dto.category,
        funding_goal: str_to_bigdecimal(&dto.funding_goal, "funding_goal")?,
        start_time: dto.start_time,
        duration: dto.duration,
        total_pledged: str_to_bigdecimal("0", "total_pledged")?,
        base_currency: PaymentCurrency::Ethereum,
        status: ProjectStatus::Initial,
        blockchain_status: BlockchainStatus::None,
    };

    let project_result = context
        .repo
        .project
        .create_project(props)
        .await
        .map_err(|e| match e {
            DbError::Unique(_) => ApiError::bad_request()
                .code(ApiErrorCode::ProjectExists)
                .message("Project with name already exists"),
            _ => ApiError::internal_error().message(format!("Failed to create project: {}", e)),
        })?;

    Ok((StatusCode::CREATED, to_api_response(project_result)))
}
