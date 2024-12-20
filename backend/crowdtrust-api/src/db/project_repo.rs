use std::{collections::HashSet, sync::Arc};

use axum::async_trait;
use bigdecimal::BigDecimal;
use const_format::formatcp;
use lib_api::db::{
    db_error::{map_sqlx_err, DbError},
    db_result::list_result,
    util::{append_comma, append_in, append_limit_offset, append_op, append_order_by, DbOp},
};
use lib_types::{
    dto::{
        project::list_projects_dto::{ListProjectsQuery, ProjectSortColumn},
        sort_direction::SortDirection,
    },
    entity::{
        project_entity::{
            ProjectAssetEntityRelation, ProjectEntity, ProjectEntityRelations, ProjectListResults,
        },
        reward_entity::{RewardAssetEntityRelation, RewardEntity},
    },
    shared::project::{BlockchainStatus, PaymentCurrency, ProjectCategory, ProjectStatus},
};
use serde::{Deserialize, Serialize};
use serde_json::to_string;
use sqlx::{postgres::PgRow, PgPool, Postgres, QueryBuilder, Row, Transaction};
use uuid::Uuid;

use super::app_repo::start_transaction;

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
    pub backer_count: Option<i32>,
    pub total_pledged: Option<BigDecimal>,
    pub base_currency: Option<PaymentCurrency>,
    pub status: Option<ProjectStatus>,
    pub rewards_order: Option<Vec<String>>,
    pub assets_order: Option<Vec<String>>,
    pub blockchain_status: Option<BlockchainStatus>,
    pub transaction_hash: Option<String>,
}

impl ProjectUpdateProps {
    pub fn asset_order(order: Vec<String>) -> Self {
        Self {
            name: None,
            description: None,
            blurb: None,
            payment_address: None,
            category: None,
            funding_goal: None,
            start_time: None,
            duration: None,
            total_pledged: None,
            backer_count: None,
            base_currency: None,
            status: None,
            rewards_order: None,
            assets_order: Some(order),
            blockchain_status: None,
            transaction_hash: None,
        }
    }
    pub fn backed(backer_count: i32, total_pledged: BigDecimal) -> Self {
        Self {
            name: None,
            description: None,
            blurb: None,
            payment_address: None,
            category: None,
            funding_goal: None,
            start_time: None,
            duration: None,
            total_pledged: Some(total_pledged),
            backer_count: Some(backer_count),
            base_currency: None,
            status: None,
            rewards_order: None,
            assets_order: None,
            blockchain_status: None,
            transaction_hash: None,
        }
    }
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
    async fn update_project_tx(
        &self,
        tx: &mut Transaction<'_, Postgres>,
        id: Uuid,
        props: ProjectUpdateProps,
    ) -> Result<ProjectEntity, DbError>;
    async fn get_project_by_id(&self, id: Uuid) -> Result<ProjectEntity, DbError>;
    async fn get_project_relations_by_id(
        &self,
        id: Uuid,
        all_assets: bool,
    ) -> Result<ProjectEntityRelations, DbError>;
    async fn list_projects(&self, query: ListProjectsQuery) -> Result<ProjectListResults, DbError>;
}

pub struct ProjectRepo {
    pub db: PgPool,
}

const PROJECT_COLUMNS: &str = formatcp!(
    r#"{p}.id, {p}.user_id, {p}.name, {p}.description, {p}.blurb, {p}.contract_address, {p}.payment_address, {p}.category, {p}.funding_goal, {p}.start_time, {p}.duration, {p}.total_pledged, {p}.backer_count, {p}.base_currency, {p}.status, {p}.blockchain_status, {p}.transaction_hash, {p}.rewards_order, {p}.assets_order, {p}.created_at, {p}.updated_at"#,
    p = "projects"
);

const PROJECT_RELATION_COLUMNS: &str = formatcp!(
    r#"{projects}, {r}.id as r_id, {r}.name as r_name, {r}.description as r_description, {r}.delivery_time as r_delivery_time, {r}.price as r_price, {r}.backer_limit as r_backer_limit, {r}.backer_count as r_backer_count, {r}.created_at as r_created_at, {r}.updated_at as r_updated_at, {ri}.id as ri_id, {ri}.size as ri_size, {ri}.content_type as ri_content_type, {a}.id as a_id, {a}.size a_size, {a}.content_type as a_content_type"#,
    projects = PROJECT_COLUMNS,
    r = "r",
    ri = "ri",
    a = "a"
);

fn map_project_entity(row: PgRow) -> Result<ProjectEntity, sqlx::Error> {
    let project_id: Uuid = row.try_get("id")?;
    let assets = if let Ok(asset_id) = row.try_get::<Uuid, &str>("a_id") {
        vec![ProjectAssetEntityRelation {
            id: asset_id,
            size: row.try_get("a_size")?,
            content_type: row.try_get_unchecked("a_content_type")?,
            project_id: project_id.clone(),
        }]
    } else {
        vec![]
    };
    Ok(ProjectEntity {
        id: project_id,
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
        assets,
        assets_order: row.try_get("assets_order")?,
        created_at: row.try_get("created_at")?,
        updated_at: row.try_get("updated_at")?,
    })
}

fn map_project_relation_entity(
    row: PgRow,
    rewards: Vec<RewardEntity>,
    assets: Vec<ProjectAssetEntityRelation>,
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
        assets,
        assets_order: row.try_get("assets_order")?,
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
        let mut tx = start_transaction(&self.db).await?;
        let result = self.update_project_tx(&mut tx, id, props).await?;
        tx.commit().await.map_err(|e| DbError::SqlxError(e))?;
        Ok(result)
    }

    async fn update_project_tx(
        &self,
        tx: &mut Transaction<'_, Postgres>,
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
        let (query, update_count) =
            append_comma(query, "backer_count", props.backer_count, update_count);

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
        let (query, update_count) =
            append_comma(query, "rewards_order", props.rewards_order, update_count);
        let (query, update_count) =
            append_comma(query, "assets_order", props.assets_order, update_count);

        let (query, update_count) = append_comma(
            query,
            "transaction_hash",
            props.transaction_hash,
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
            .fetch_one(tx.as_mut())
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
        all_assets: bool,
    ) -> Result<ProjectEntityRelations, DbError> {
        let asset_query = if all_assets {
            ""
        } else {
            " AND a.state = 'Uploaded'"
        }
        .to_string();

        let result = sqlx::query(&format!(
            r#"SELECT {} FROM "projects"
            LEFT OUTER JOIN rewards r on r.project_id = projects.id
            LEFT OUTER JOIN reward_assets ri on ri.reward_id = r.id
            LEFT OUTER JOIN project_assets a on a.project_id = projects.id{}
            WHERE projects.id = $1"#,
            PROJECT_RELATION_COLUMNS, asset_query
        ))
        .bind(id)
        .fetch_all(&self.db)
        .await
        .map_err(map_sqlx_err)?;

        if result.len() == 0 {
            return Err(DbError::EntityNotFound());
        }
        let mut rewards: Vec<RewardEntity> = vec![];
        let mut assets: Vec<ProjectAssetEntityRelation> = vec![];
        let mut used_ids: HashSet<Uuid> = HashSet::new();
        for row in result.iter() {
            if let Ok(reward_id) = row.try_get::<Uuid, &str>("r_id") {
                if !used_ids.contains(&reward_id) {
                    used_ids.insert(reward_id.clone());
                    let image = if let Ok(image_id) = row.try_get("ri_id") {
                        Some(RewardAssetEntityRelation {
                            id: image_id,
                            project_id: id.clone(),
                            size: row.try_get("ri_size")?,
                            content_type: row.try_get_unchecked("ri_content_type")?,
                        })
                    } else {
                        None
                    };
                    rewards.push(RewardEntity {
                        id: reward_id,
                        project_id: id.clone(),
                        name: row.try_get("r_name")?,
                        description: row.try_get("r_description")?,
                        delivery_time: row.try_get("r_delivery_time")?,
                        price: row.try_get("r_price")?,
                        backer_limit: row.try_get("r_backer_limit")?,
                        image,
                        backer_count: row.try_get("r_backer_count")?,
                        created_at: row.try_get("r_created_at")?,
                        updated_at: row.try_get("r_updated_at")?,
                    });
                }
            };
            if let Ok(asset_id) = row.try_get::<Uuid, &str>("a_id") {
                if !used_ids.contains(&asset_id) {
                    used_ids.insert(asset_id.clone());
                    assets.push(ProjectAssetEntityRelation {
                        id: row.try_get("a_id")?,
                        size: row.try_get("a_size")?,
                        content_type: row.try_get_unchecked("a_content_type")?,
                        project_id: id.clone(),
                    });
                }
            }
        }
        if let Some(row) = result.into_iter().nth(0) {
            Ok(map_project_relation_entity(row, rewards, assets).map_err(map_sqlx_err)?)
        } else {
            Err(DbError::EntityNotFound())
        }
    }

    async fn list_projects(&self, query: ListProjectsQuery) -> Result<ProjectListResults, DbError> {
        let mut filtered_query = QueryBuilder::new(format!("SELECT {}, a.id as a_id, a.size a_size, a.content_type as a_content_type, COUNT(projects.id) OVER () FROM \"projects\" LEFT OUTER JOIN project_assets a on a.project_id = projects.id AND projects.assets_order[1] = a.id::text", PROJECT_COLUMNS));

        if query.categories.is_some() || query.statuses.is_some() || query.user_id.is_some() {
            filtered_query.push(" WHERE");
        }

        // Filter categories
        let (filtered_query, count) = append_in(filtered_query, "category", query.categories, 0);
        // Filter statuses
        let (filtered_query, count) = append_in(filtered_query, "status", query.statuses, count);
        // Filter user_id
        let (mut filtered_query, _) = if let Some(user_id) = query.user_id {
            let (mut q, c) = append_op(filtered_query, DbOp::And, count);
            q.push(" projects.user_id::text = ");
            q.push_bind(user_id);
            (q, c)
        } else {
            (filtered_query, count)
        };
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
