use std::sync::Arc;

use axum::async_trait;
use chrono::{DateTime, Utc};
use const_format::formatcp;
use lib_api::db::db_error::DbError;
use lib_types::entity::reward_asset_entity::RewardAssetEntity;
use lib_types::shared::asset::AssetState;
use sqlx::{postgres::PgRow, PgPool, Row};
use uuid::Uuid;

pub type DynRewardAssetRepo = Arc<dyn RewardAssetRepoTrait + Send + Sync>;

#[async_trait]
pub trait RewardAssetRepoTrait {
    fn get_db(&self) -> &PgPool;
    async fn create_reward_asset(
        &self,
        dto: RewardAssetEntityProps,
    ) -> Result<RewardAssetEntity, DbError>;

    async fn get_reward_asset_by_id(&self, id: Uuid) -> Result<RewardAssetEntity, DbError>;

    async fn update_reward_asset_state(&self, id: Uuid, state: AssetState) -> Result<(), DbError>;

    async fn delete_reward_asset_by_id(&self, id: Uuid) -> Result<(), DbError>;
}

pub struct RewardAssetRepo {
    pub db: PgPool,
}

pub struct RewardAssetEntityProps {
    pub size: i64,
    pub content_type: String,
    pub state: AssetState,
    pub user_id: Uuid,
    pub reward_id: Uuid,
    pub upload_expires_at: DateTime<Utc>,
}
const REWARD_ASSET_COLUMNS: &str = r#"id, reward_id, user_id, size, content_type, state, upload_expires_at, created_at, updated_at"#;

fn map_reward_asset_entity(row: PgRow) -> Result<RewardAssetEntity, sqlx::Error> {
    Ok(RewardAssetEntity {
        id: row.try_get("id")?,
        reward_id: row.try_get("reward_id")?,
        user_id: row.try_get("user_id")?,
        size: row.try_get("size")?,
        content_type: row.try_get_unchecked("content_type")?,
        state: row.try_get_unchecked("state")?,
        upload_expires_at: row.try_get("upload_expires_at")?,
        created_at: row.try_get("created_at")?,
        updated_at: row.try_get("updated_at")?,
    })
}

#[async_trait]
impl RewardAssetRepoTrait for RewardAssetRepo {
    fn get_db(&self) -> &PgPool {
        &self.db
    }

    async fn create_reward_asset(
        &self,
        props: RewardAssetEntityProps,
    ) -> Result<RewardAssetEntity, DbError> {
        Ok(sqlx::query(formatcp!(
            // language=PostgreSQL
            r#"
              INSERT INTO "reward_assets" (reward_id, user_id, size, content_type, state, upload_expires_at)
              values ($1, $2, $3, $4, $5, $6)
              RETURNING {}
            "#,
            REWARD_ASSET_COLUMNS
        ))
        .bind(props.reward_id)
        .bind(props.user_id)
        .bind(props.size)
        .bind(props.content_type)
        .bind(props.state.to_string())
        .bind(props.upload_expires_at)
        .try_map(map_reward_asset_entity)
        .fetch_one(&self.db)
        .await?)
    }

    async fn get_reward_asset_by_id(&self, id: Uuid) -> Result<RewardAssetEntity, DbError> {
        Ok(sqlx::query(formatcp!(
            "SELECT {} FROM reward_assets WHERE id = $1",
            REWARD_ASSET_COLUMNS
        ))
        .bind(id)
        .try_map(map_reward_asset_entity)
        .fetch_one(&self.db)
        .await?)
    }

    async fn update_reward_asset_state(&self, id: Uuid, state: AssetState) -> Result<(), DbError> {
        sqlx::query(formatcp!(
            "UPDATE reward_assets SET state = $1 WHERE id = $2"
        ))
        .bind(state.to_string())
        .bind(id)
        .execute(&self.db)
        .await?;
        Ok(())
    }

    async fn delete_reward_asset_by_id(&self, id: Uuid) -> Result<(), DbError> {
        sqlx::query(r#"DELETE FROM "reward_assets" WHERE id = $1"#)
            .bind(id)
            .execute(&self.db)
            .await?;

        Ok(())
    }
}
