use std::sync::Arc;

use axum::async_trait;
use bigdecimal::BigDecimal;
use const_format::formatcp;
use lib_api::db::{
    db_error::{map_sqlx_err, DbError},
    db_result::list_result,
    util::{
        append_and_eq, append_comma, append_in, append_limit_offset, append_order_by,
        option_string_to_uuid,
    },
};
use lib_types::{
    dto::{
        project::list_projects_dto::{ListProjectsQuery, ProjectSortColumn},
        sort_direction::SortDirection,
    },
    entity::{
        project_entity::{ProjectEntity, ProjectEntityRelations, ProjectListResults},
        reward_entity::RewardEntity,
    },
    shared::project::{BlockchainStatus, PaymentCurrency, ProjectCategory, ProjectStatus},
};
use serde::{Deserialize, Serialize};
use serde_json::to_string;
use sqlx::{postgres::PgRow, PgPool, QueryBuilder, Row};
use uuid::Uuid;

pub type DynProjectRepo = Arc<dyn ProjectRepoTrait + Send + Sync>;

#[derive(Debug, Deserialize, Serialize, sqlx::Type)]
pub struct ProjectCreateProps {
    pub user_id: Uuid,
    pub name: String,
    pub description: String,
    pub blurb: String,
    pub contract_address: String,
    pub payment_address: String,
    pub category: ProjectCategory,
    pub funding_goal: BigDecimal,
    pub start_time: i64,
    pub duration: i64,
    pub total_pledged: BigDecimal,
    pub base_currency: PaymentCurrency,
    pub status: ProjectStatus,
    pub blockchain_status: BlockchainStatus,
}

#[derive(Debug, Deserialize, Serialize, sqlx::Type)]
pub struct ProjectUpdateProps {
    pub name: Option<String>,
    pub description: Option<String>,
    pub blurb: Option<String>,
    pub payment_address: Option<String>,
    pub category: Option<ProjectCategory>,
    pub funding_goal: Option<BigDecimal>,
    pub start_time: Option<i64>,
    pub duration: Option<i64>,
    pub total_pledged: Option<BigDecimal>,
    pub base_currency: Option<PaymentCurrency>,
    pub status: Option<ProjectStatus>,
    pub blockchain_status: Option<BlockchainStatus>,
}

#[async_trait]
pub trait ProjectRepoTrait {
    fn get_db(&self) -> &PgPool;
    async fn create_project(&self, props: ProjectCreateProps) -> Result<ProjectEntity, DbError>;
    async fn update_project(
        &self,
        id: Uuid,
        props: ProjectUpdateProps,
    ) -> Result<ProjectEntity, DbError>;
    async fn get_project_by_id(&self, id: Uuid) -> Result<ProjectEntity, DbError>;
    async fn get_project_relations_by_id(
        &self,
        id: Uuid,
    ) -> Result<ProjectEntityRelations, DbError>;
    async fn list_projects(&self, query: ListProjectsQuery) -> Result<ProjectListResults, DbError>;
}

pub struct ProjectRepo {
    pub db: PgPool,
}

const PROJECT_COLUMNS: &str = formatcp!(
    r#"{p}.id, {p}.user_id, {p}.name, {p}.description, {p}.blurb, {p}.contract_address, {p}.payment_address, {p}.category, {p}.funding_goal, {p}.start_time, {p}.duration, {p}.total_pledged, {p}.backer_count, {p}.base_currency, {p}.status, {p}.blockchain_status, {p}.transaction_hash, {p}.rewards_order, {p}.created_at, {p}.updated_at"#,
    p = "projects"
);

const PROJECT_RELATION_COLUMNS: &str = formatcp!(
    r#"{projects}, {r}.id as r_id, {r}.name as r_name, {r}.description as r_description, {r}.delivery_time as r_delivery_time, {r}.price as r_price, {r}.backer_limit as r_backer_limit, {r}.backer_count as r_backer_count, {r}.created_at as r_created_at, {r}.updated_at as r_updated_at"#,
    projects = PROJECT_COLUMNS,
    r = "r"
);

fn map_project_entity(row: PgRow) -> Result<ProjectEntity, sqlx::Error> {
    Ok(ProjectEntity {
        id: row.try_get("id")?,
        user_id: row.try_get("user_id")?,
        name: row.try_get("name")?,
        description: row.try_get("description")?,
        blurb: row.try_get("blurb")?,
        contract_address: row.try_get("contract_address")?,
        payment_address: row.try_get("payment_address")?,
        category: row.try_get_unchecked("category")?,
        funding_goal: row.try_get("funding_goal")?,
        start_time: row.try_get("start_time")?,
        duration: row.try_get("duration")?,
        total_pledged: row.try_get("total_pledged")?,
        backer_count: row.try_get("backer_count")?,
        base_currency: row.try_get_unchecked("base_currency")?,
        status: row.try_get_unchecked("status")?,
        blockchain_status: row.try_get_unchecked("blockchain_status")?,
        transaction_hash: row.try_get("transaction_hash")?,
        rewards_order: row.try_get("rewards_order")?,
        created_at: row.try_get("created_at")?,
        updated_at: row.try_get("updated_at")?,
    })
}

fn map_project_relation_entity(
    row: PgRow,
    rewards: Vec<RewardEntity>,
) -> Result<ProjectEntityRelations, sqlx::Error> {
    Ok(ProjectEntityRelations {
        id: row.try_get("id")?,
        user_id: row.try_get("user_id")?,
        name: row.try_get("name")?,
        description: row.try_get("description")?,
        blurb: row.try_get("blurb")?,
        contract_address: row.try_get("contract_address")?,
        payment_address: row.try_get("payment_address")?,
        category: row.try_get_unchecked("category")?,
        funding_goal: row.try_get("funding_goal")?,
        start_time: row.try_get("start_time")?,
        duration: row.try_get("duration")?,
        total_pledged: row.try_get("total_pledged")?,
        backer_count: row.try_get("backer_count")?,
        base_currency: row.try_get_unchecked("base_currency")?,
        status: row.try_get_unchecked("status")?,
        blockchain_status: row.try_get_unchecked("blockchain_status")?,
        transaction_hash: row.try_get("transaction_hash")?,
        rewards,
        rewards_order: row.try_get("rewards_order")?,
        created_at: row.try_get("created_at")?,
        updated_at: row.try_get("updated_at")?,
    })
}

fn map_project_list_entity(row: PgRow) -> Result<(ProjectEntity, i64), sqlx::Error> {
    let count = row.try_get("count")?;
    let entity = map_project_entity(row)?;
    Ok((entity, count))
}

#[async_trait]
impl ProjectRepoTrait for ProjectRepo {
    fn get_db(&self) -> &PgPool {
        &self.db
    }

    async fn create_project(&self, props: ProjectCreateProps) -> Result<ProjectEntity, DbError> {
        Ok(sqlx::query(formatcp!(
            // language=PostgreSQL
            r#"
              INSERT INTO "projects" (user_id, name, description, blurb, contract_address, payment_address, category, funding_goal, start_time, duration, total_pledged, base_currency, status, blockchain_status)
              values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
              RETURNING {}
            "#,
            PROJECT_COLUMNS
        ))
        .bind(props.user_id)
        .bind(props.name)
        .bind(props.description)
        .bind(props.blurb)
        .bind(props.contract_address)
        .bind(props.payment_address)
        .bind(props.category.to_string())
        .bind(props.funding_goal)
        .bind(props.start_time)
        .bind(props.duration)
        .bind(props.total_pledged)
        .bind(props.base_currency.to_string())
        .bind(props.status.to_string())
        .bind(props.blockchain_status.to_string())
        .try_map(map_project_entity)
        .fetch_one(&self.db)
        .await.map_err(|e| match e {
            sqlx::Error::Database(dbe) if dbe.constraint() == Some("projects_name_key") => {
                DbError::Unique("name".into())
            }
            _ => DbError::Query(e.to_string()),
        })?)
    }

    async fn update_project(
        &self,
        id: Uuid,
        props: ProjectUpdateProps,
    ) -> Result<ProjectEntity, DbError> {
        let query = QueryBuilder::new("UPDATE projects SET");
        let update_count = 0;

        let (query, update_count) = append_comma(query, "name", props.name, update_count);
        let (query, update_count) =
            append_comma(query, "description", props.description, update_count);
        let (query, update_count) = append_comma(query, "blurb", props.blurb, update_count);

        let (query, update_count) = append_comma(
            query,
            "category",
            props.category.and_then(|c| Some(c.to_string())),
            update_count,
        );
        let (query, update_count) =
            append_comma(query, "funding_goal", props.funding_goal, update_count);
        let (query, update_count) = append_comma(
            query,
            "payment_address",
            props.payment_address,
            update_count,
        );

        let (query, update_count) =
            append_comma(query, "start_time", props.start_time, update_count);

        let (query, update_count) = append_comma(query, "duration", props.duration, update_count);

        let (query, update_count) =
            append_comma(query, "total_pledged", props.total_pledged, update_count);

        let (query, update_count) = append_comma(
            query,
            "base_currency",
            props.base_currency.and_then(|c| Some(c.to_string())),
            update_count,
        );

        let (query, update_count) = append_comma(
            query,
            "status",
            props.status.and_then(|s| Some(s.to_string())),
            update_count,
        );

        let (mut query, update_count) = append_comma(
            query,
            "blockchain_status",
            props.blockchain_status.and_then(|s| Some(s.to_string())),
            update_count,
        );

        if update_count == 0 {
            return Err(DbError::NoUpdate);
        }

        query.push(" WHERE id = ");
        query.push_bind(id);
        query.push(formatcp!(" RETURNING {}", PROJECT_COLUMNS));

        Ok(query
            .build()
            .try_map(map_project_entity)
            .fetch_one(&self.db)
            .await
            .map_err(|e| match e {
                sqlx::Error::RowNotFound => DbError::EntityNotFound(),
                sqlx::Error::Database(dbe) if dbe.constraint() == Some("projects_name_key") => {
                    DbError::Unique("name".into())
                }
                _ => DbError::Query(e.to_string()),
            })?)
    }

    async fn get_project_by_id(&self, id: Uuid) -> Result<ProjectEntity, DbError> {
        Ok(sqlx::query(formatcp!(
            "SELECT {} FROM \"projects\" WHERE id = $1",
            PROJECT_COLUMNS
        ))
        .bind(id)
        .try_map(map_project_entity)
        .fetch_one(&self.db)
        .await
        .map_err(map_sqlx_err)?)
    }

    async fn get_project_relations_by_id(
        &self,
        id: Uuid,
    ) -> Result<ProjectEntityRelations, DbError> {
        let result = sqlx::query(formatcp!(
            "SELECT {} FROM \"projects\" LEFT OUTER JOIN rewards r on r.project_id = projects.id WHERE projects.id = $1",
            PROJECT_RELATION_COLUMNS
        ))
        .bind(id)
        .fetch_all(&self.db)
        .await
        .map_err(map_sqlx_err)?;

        if result.len() == 0 {
            return Err(DbError::EntityNotFound());
        }
        let mut rewards: Vec<RewardEntity> = vec![];
        for row in result.iter() {
            if row.try_get::<Uuid, &str>("r_id").is_err() {
                continue;
            }
            rewards.push(RewardEntity {
                id: row.try_get("r_id")?,
                project_id: id.clone(),
                name: row.try_get("r_name")?,
                description: row.try_get("r_description")?,
                delivery_time: row.try_get("r_delivery_time")?,
                price: row.try_get("r_price")?,
                backer_limit: row.try_get("r_backer_limit")?,
                backer_count: row.try_get("r_backer_count")?,
                created_at: row.try_get("r_created_at")?,
                updated_at: row.try_get("r_updated_at")?,
            });
        }
        if let Some(row) = result.into_iter().nth(0) {
            Ok(map_project_relation_entity(row, rewards).map_err(map_sqlx_err)?)
        } else {
            Err(DbError::EntityNotFound())
        }
    }

    async fn list_projects(&self, query: ListProjectsQuery) -> Result<ProjectListResults, DbError> {
        let filtered_query =
            if query.categories.is_none() && query.statuses.is_none() && query.user_id.is_none() {
                QueryBuilder::new("SELECT *, COUNT(*) OVER () FROM \"projects\"")
            } else {
                QueryBuilder::new("SELECT *, COUNT(*) OVER () FROM \"projects\" WHERE")
            };

        // Filter categories
        let (filtered_query, count) = append_in(filtered_query, "category", query.categories, 0);
        // Filter statuses
        let (filtered_query, count) = append_in(filtered_query, "status", query.statuses, count);
        // Filter user_id
        let (mut filtered_query, _) = append_and_eq(
            filtered_query,
            "user_id",
            option_string_to_uuid(query.user_id),
            count,
        );
        // ORDER BY
        let column = to_string(&query.column.unwrap_or(ProjectSortColumn::CreatedAt))
            .map_err(|e| DbError::Serialize(e.to_string()))?;
        let direction = query.direction.unwrap_or(SortDirection::Desc);

        filtered_query = append_order_by(filtered_query, column, direction.to_string());
        filtered_query = append_limit_offset(filtered_query, query.from, query.to);
        let results = filtered_query
            .build()
            .try_map(map_project_list_entity)
            .fetch_all(&self.db)
            .await?;

        let (results, total) = list_result(results);

        Ok(ProjectListResults { total, results })
    }
}
