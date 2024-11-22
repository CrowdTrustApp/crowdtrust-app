use std::sync::Arc;

use axum::async_trait;
use bigdecimal::BigDecimal;
use const_format::formatcp;
use lib_api::db::{db_error::DbError, util::append_comma};
use lib_types::entity::reward_entity::RewardEntity;
use serde::{Deserialize, Serialize};
use sqlx::{postgres::PgRow, PgPool, QueryBuilder, Row};
use uuid::Uuid;

pub type DynRewardRepo = Arc<dyn RewardRepoTrait + Send + Sync>;

#[derive(Debug, Deserialize, Serialize, sqlx::Type)]
pub struct RewardCreateProps {
    pub project_id: Uuid,
    pub name: String,
    pub description: String,
    pub price: BigDecimal,
    pub delivery_time: i64,
    pub backer_limit: i64,
}

#[derive(Debug, Deserialize, Serialize, sqlx::Type)]
pub struct RewardUpdateProps {
    pub name: Option<String>,
    pub description: Option<String>,
    pub price: Option<BigDecimal>,
    pub delivery_time: Option<i64>,
    pub backer_count: Option<BigDecimal>,
    pub backer_limit: Option<i64>,
    pub visible: Option<bool>,
}

#[async_trait]
pub trait RewardRepoTrait {
    fn get_db(&self) -> &PgPool;
    async fn create_reward(&self, props: RewardCreateProps) -> Result<Uuid, DbError>;
    async fn update_reward(&self, id: Uuid, props: RewardUpdateProps) -> Result<(), DbError>;
    async fn get_reward_by_id(&self, id: Uuid) -> Result<RewardEntity, DbError>;
    async fn delete_reward_by_id(&self, id: Uuid) -> Result<(), DbError>;
}

pub struct RewardRepo {
    pub db: PgPool,
}

const REWARD_COLUMNS: &str = r#"id, project_id, name, description, delivery_time, price, backer_limit, backer_count, created_at, updated_at"#;

fn map_reward_entity(row: PgRow) -> Result<RewardEntity, sqlx::Error> {
    Ok(RewardEntity {
        id: row.try_get("id")?,
        project_id: row.try_get("project_id")?,
        name: row.try_get("name")?,
        description: row.try_get("description")?,
        delivery_time: row.try_get_unchecked("delivery_time")?,
        price: row.try_get_unchecked("price")?,
        backer_limit: row.try_get("backer_limit")?,
        backer_count: row.try_get("backer_count")?,
        image: None,
        created_at: row.try_get("created_at")?,
        updated_at: row.try_get("updated_at")?,
    })
}

#[async_trait]
impl RewardRepoTrait for RewardRepo {
    fn get_db(&self) -> &PgPool {
        &self.db
    }

    async fn create_reward(&self, props: RewardCreateProps) -> Result<Uuid, DbError> {
        let row = sqlx::query(formatcp!(
            // language=PostgreSQL
            r#"
              INSERT INTO "rewards" (project_id, name, description, price, delivery_time, backer_limit)
              values ($1, $2, $3, $4, $5, $6)
              RETURNING id
            "#
        ))
        .bind(props.project_id)
        .bind(props.name)
        .bind(props.description)
        .bind(props.price)
        .bind(props.delivery_time)
        .bind(props.backer_limit)
        .fetch_one(&self.db)
        .await.map_err(|e| match e {
            sqlx::Error::Database(dbe) if dbe.constraint() == Some("rewards_name_key") => {
                DbError::Unique("name".into())
            }
            _ => DbError::Query(e.to_string()),
        })?;
        Ok(row.try_get("id")?)
    }

    async fn update_reward(&self, id: Uuid, props: RewardUpdateProps) -> Result<(), DbError> {
        let query = QueryBuilder::new("UPDATE rewards SET");
        let update_count = 0;

        let (query, update_count) = append_comma(query, "name", props.name, update_count);
        let (query, update_count) =
            append_comma(query, "description", props.description, update_count);

        let (query, update_count) = append_comma(query, "price", props.price, update_count);
        let (query, update_count) =
            append_comma(query, "delivery_time", props.delivery_time, update_count);
        let (query, update_count) =
            append_comma(query, "backer_count", props.backer_count, update_count);

        let (query, update_count) =
            append_comma(query, "backer_limit", props.backer_limit, update_count);

        let (mut query, update_count) = append_comma(query, "visible", props.visible, update_count);

        if update_count == 0 {
            return Err(DbError::NoUpdate);
        }

        query.push(" WHERE id = ");
        query.push_bind(id);

        query.build().execute(&self.db).await.map_err(|e| match e {
            sqlx::Error::RowNotFound => DbError::EntityNotFound(),
            _ => DbError::Query(e.to_string()),
        })?;

        Ok(())
    }

    async fn get_reward_by_id(&self, id: Uuid) -> Result<RewardEntity, DbError> {
        Ok(sqlx::query(formatcp!(
            "SELECT {} FROM rewards WHERE id = $1",
            REWARD_COLUMNS
        ))
        .bind(id)
        .try_map(map_reward_entity)
        .fetch_one(&self.db)
        .await?)
    }

    async fn delete_reward_by_id(&self, id: Uuid) -> Result<(), DbError> {
        sqlx::query(r#"DELETE FROM "rewards" WHERE id = $1"#)
            .bind(id)
            .execute(&self.db)
            .await?;

        Ok(())
    }
}
