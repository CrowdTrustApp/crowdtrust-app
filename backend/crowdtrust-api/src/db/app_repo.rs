use std::sync::Arc;

use lib_api::{
    db::{db_error::DbError, db_setup::app_db_connect},
    error::api_error::ApiError,
};
use sqlx::{PgPool, Postgres, Transaction};

use super::{
    project_asset_repo::{DynProjectAssetRepo, ProjectAssetRepo},
    project_repo::{DynProjectRepo, ProjectRepo},
    reward_asset_repo::{DynRewardAssetRepo, RewardAssetRepo},
    reward_repo::{DynRewardRepo, RewardRepo},
    user_repo::{DynUserRepo, UserRepo},
};

#[derive(Clone)]
pub struct AppRepo {
    pub db: PgPool,
    pub user: DynUserRepo,
    pub project: DynProjectRepo,
    pub project_asset: DynProjectAssetRepo,
    pub reward: DynRewardRepo,
    pub reward_asset: DynRewardAssetRepo,
}

impl AppRepo {
    pub async fn new(db_url: &str, db_name: &str) -> Result<Self, DbError> {
        let db_url = format!("{}{}", db_url, db_name);
        let db = app_db_connect(&db_url, db_name).await?;

        Ok(AppRepo {
            db: db.clone(),
            user: Arc::new(UserRepo { db: db.clone() }) as DynUserRepo,
            project: Arc::new(ProjectRepo { db: db.clone() }) as DynProjectRepo,
            project_asset: Arc::new(ProjectAssetRepo { db: db.clone() }) as DynProjectAssetRepo,
            reward: Arc::new(RewardRepo { db: db.clone() }) as DynRewardRepo,
            reward_asset: Arc::new(RewardAssetRepo { db: db.clone() }) as DynRewardAssetRepo,
        })
    }

    pub async fn start_transaction(&self) -> Result<Transaction<'_, Postgres>, ApiError> {
        let transaction = self
            .db
            .begin()
            .await
            .map_err(|e| ApiError::internal_error().message(e))?;
        Ok(transaction)
    }
}
