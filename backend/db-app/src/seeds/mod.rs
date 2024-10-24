use lib_api::db::db_error::DbError;
use sqlx::PgPool;

pub mod s010_users;
pub mod s020_projects;
pub mod s025_project_assets;
pub mod s030_rewards;
pub mod s035_reward_assets;
pub mod s040_pledges;
pub mod s045_pledge_items;

pub async fn seed_all(db: &PgPool) -> Result<(), DbError> {
    s010_users::seed(db).await?;
    s020_projects::seed(db).await?;
    s025_project_assets::seed(db).await?;
    s030_rewards::seed(db).await?;
    s035_reward_assets::seed(db).await?;
    s040_pledges::seed(db).await?;
    s045_pledge_items::seed(db).await?;
    Ok(())
}
