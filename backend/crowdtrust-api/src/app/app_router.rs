use crate::{
    api_context::ApiContext,
    app::{auth, project, user},
    util::auth::{auth_admin, auth_admin_user, auth_admin_user_anonymous},
};
use axum::{
    handler::Handler,
    http::StatusCode,
    middleware::from_fn_with_state,
    response::IntoResponse,
    routing::{delete, get, patch, post},
    Router,
};

use super::{health, project_asset, reward, reward_asset};

pub fn app_router(context: &ApiContext) -> Router<ApiContext> {
    Router::new().nest("/api", api_router(context))
}

pub fn api_router(context: &ApiContext) -> Router<ApiContext> {
    Router::new()
        .route("/healthz", get(health::get_app_health::get_app_health))
        .route(
            "/users",
            get(user::list_users::list_users)
                .route_layer(from_fn_with_state(context.clone(), auth_admin)),
        )
        .route(
            "/users/:user_id",
            get(user::get_user::get_user)
                .patch(user::update_user::update_user)
                .route_layer(from_fn_with_state(context.clone(), auth_admin_user)),
        )
        .route(
            "/users/registrations",
            post(user::register_user::register_user),
        )
        .route("/users/queries/exists", get(user::user_exists::user_exists))
        .route("/auth/logins", post(auth::login_user::login_user))
        .route(
            "/auth/logins/reset-password",
            post(auth::reset_password::reset_password),
        )
        .route(
            "/auth/logins/passwords",
            patch(auth::update_password::update_password)
                .route_layer(from_fn_with_state(context.clone(), auth_admin_user)),
        )
        .route(
            "/auth/confirm-email",
            post(auth::confirm_email::confirm_email),
        )
        .route(
            "/auth/resend-confirm-email",
            post(auth::resend_confirm_email::resend_confirm_email)
                .route_layer(from_fn_with_state(context.clone(), auth_admin_user)),
        )
        .route(
            "/projects",
            post(
                project::create_project::create_project
                    .layer(from_fn_with_state(context.clone(), auth_admin_user)),
            )
            .get(
                project::list_projects::list_projects.layer(from_fn_with_state(
                    context.clone(),
                    auth_admin_user_anonymous,
                )),
            ),
        )
        .route(
            "/projects/:project_id",
            get(project::get_project::get_project.layer(from_fn_with_state(
                context.clone(),
                auth_admin_user_anonymous,
            )))
            .patch(
                project::update_project::update_project
                    .layer(from_fn_with_state(context.clone(), auth_admin_user)),
            ),
        )
        .route(
            "/projects/:project_id/actions/back",
            post(
                project::back_project::back_project
                    .layer(from_fn_with_state(context.clone(), auth_admin_user)),
            ),
        )
        .route(
            "/projects/:project_id/rewards",
            post(
                reward::create_reward::create_reward
                    .layer(from_fn_with_state(context.clone(), auth_admin_user)),
            ),
        )
        .route(
            "/rewards/:reward_id",
            patch(reward::update_reward::update_reward)
                .delete(reward::delete_reward::delete_reward)
                .route_layer(from_fn_with_state(context.clone(), auth_admin_user)),
        )
        .route(
            "/reward-assets",
            post(reward_asset::create_reward_asset::create_reward_asset)
                .route_layer(from_fn_with_state(context.clone(), auth_admin_user)),
        )
        .route(
            "/reward-assets/:asset_id",
            delete(reward_asset::delete_reward_asset::delete_reward_asset)
                .route_layer(from_fn_with_state(context.clone(), auth_admin_user)),
        )
        .route(
            "/reward-assets/:asset_id/actions/verify",
            post(reward_asset::verify_reward_asset::verify_reward_asset)
                .route_layer(from_fn_with_state(context.clone(), auth_admin_user)),
        )
        .route(
            "/project-assets",
            post(project_asset::create_project_asset::create_project_asset)
                .get(project_asset::list_project_assets::list_project_assets)
                .route_layer(from_fn_with_state(context.clone(), auth_admin_user)),
        )
        .route(
            "/project-assets/:asset_id",
            patch(project_asset::update_project_asset::update_project_asset)
                .delete(project_asset::delete_project_asset::delete_project_asset)
                .route_layer(from_fn_with_state(context.clone(), auth_admin_user)),
        )
        .route(
            "/project-assets/:asset_id/actions/verify",
            post(project_asset::verify_project_asset::verify_project_asset)
                .route_layer(from_fn_with_state(context.clone(), auth_admin_user)),
        )
        .route("/*path", get(handler_404)) // Handle unknown routes under /api
}

async fn handler_404() -> impl IntoResponse {
    (StatusCode::NOT_FOUND, "Resource not found")
}
