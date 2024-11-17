use std::sync::Arc;

use axum::async_trait;
use chrono::{DateTime, Utc};
use const_format::formatcp;
use lib_api::db::util::append_limit_offset;
use lib_api::db::{
    db_error::{map_sqlx_err, DbError},
    util::{
        append_and_eq, append_comma, append_order_by, option_enum_to_string, option_string_to_uuid,
    },
};
use lib_types::dto::project_asset::list_project_assets_dto::{
    ListProjectAssetsQuery, ProjectAssetSortColumn,
};
use lib_types::dto::project_asset::update_project_asset_dto::UpdateProjectAssetDto;
use lib_types::dto::sort_direction::SortDirection;
use lib_types::entity::project_asset_entity::ProjectAssetEntity;
use lib_types::entity::project_asset_entity::ProjectAssetListResults;
use lib_types::shared::asset::AssetState;
use serde_json::to_string;
use sqlx::{postgres::PgRow, PgPool, QueryBuilder, Row};
use uuid::Uuid;

pub type DynProjectAssetRepo = Arc<dyn ProjectAssetRepoTrait + Send + Sync>;

#[async_trait]
pub trait ProjectAssetRepoTrait {
    fn get_db(&self) -> &PgPool;
    async fn create_project_asset(
        &self,
        dto: ProjectAssetEntityProps,
    ) -> Result<ProjectAssetEntity, DbError>;

    async fn get_project_asset_by_id(&self, id: Uuid) -> Result<ProjectAssetEntity, DbError>;

    async fn list_project_assets(
        &self,
        query: ListProjectAssetsQuery,
    ) -> Result<ProjectAssetListResults, DbError>;

    async fn update_project_asset_state(&self, id: Uuid, state: AssetState) -> Result<(), DbError>;

    async fn update_project_asset(
        &self,
        id: Uuid,
        dto: UpdateProjectAssetDto,
    ) -> Result<ProjectAssetEntity, DbError>;

    async fn delete_project_asset_by_id(&self, id: Uuid) -> Result<(), DbError>;
    async fn get_total_asset_usage_by_user(&self, user_id: Uuid) -> Result<i64, DbError>;
}

pub struct ProjectAssetRepo {
    pub db: PgPool,
}

pub struct ProjectAssetEntityProps {
    pub size: i64,
    pub content_type: String,
    pub state: AssetState,
    pub user_id: Uuid,
    pub project_id: Uuid,
    pub upload_expires_at: DateTime<Utc>,
}
const PROJECT_ASSET_COLUMNS: &str = r#"id, project_id, user_id, size, content_type, state, upload_expires_at, created_at, updated_at"#;

fn map_project_asset_entity(row: PgRow) -> Result<ProjectAssetEntity, sqlx::Error> {
    Ok(ProjectAssetEntity {
        id: row.try_get("id")?,
        project_id: row.try_get("project_id")?,
        user_id: row.try_get("user_id")?,
        size: row.try_get("size")?,
        content_type: row.try_get_unchecked("content_type")?,
        state: row.try_get_unchecked("state")?,
        upload_expires_at: row.try_get("upload_expires_at")?,
        created_at: row.try_get("created_at")?,
        updated_at: row.try_get("updated_at")?,
    })
}

fn project_asset_list_result<T>(results: Vec<(T, i64, u64)>) -> (Vec<T>, i64, u64) {
    let mut total = 0;
    let mut total_usage = 0;
    if let Some(item) = results.first() {
        total = item.1;
        total_usage = item.2
    }
    let items = results.into_iter().map(|t| t.0).collect();
    return (items, total, total_usage);
}

fn map_project_asset_list_entity(
    row: PgRow,
) -> Result<(ProjectAssetEntity, i64, u64), sqlx::Error> {
    let count = row.try_get("count")?;
    let total_usage: i64 = row.try_get("total_usage")?;
    let entity = map_project_asset_entity(row)?;
    Ok((entity, count, total_usage as u64))
}

#[async_trait]
impl ProjectAssetRepoTrait for ProjectAssetRepo {
    fn get_db(&self) -> &PgPool {
        &self.db
    }

    async fn create_project_asset(
        &self,
        props: ProjectAssetEntityProps,
    ) -> Result<ProjectAssetEntity, DbError> {
        Ok(sqlx::query(formatcp!(
            // language=PostgreSQL
            r#"
              INSERT INTO "project_assets" (project_id, user_id, size, content_type, state, upload_expires_at)
              values ($1, $2, $3, $4, $5, $6)
              RETURNING {}
            "#,
            PROJECT_ASSET_COLUMNS
        ))
        .bind(props.project_id)
        .bind(props.user_id)
        .bind(props.size)
        .bind(props.content_type)
        .bind(props.state.to_string())
        .bind(props.upload_expires_at)
        .try_map(map_project_asset_entity)
        .fetch_one(&self.db)
        .await?)
    }

    async fn get_project_asset_by_id(&self, id: Uuid) -> Result<ProjectAssetEntity, DbError> {
        Ok(sqlx::query(formatcp!(
            "SELECT {} FROM project_assets WHERE id = $1",
            PROJECT_ASSET_COLUMNS
        ))
        .bind(id)
        .try_map(map_project_asset_entity)
        .fetch_one(&self.db)
        .await?)
    }

    async fn update_project_asset_state(&self, id: Uuid, state: AssetState) -> Result<(), DbError> {
        sqlx::query(formatcp!(
            "UPDATE project_assets SET state = $1 WHERE id = $2"
        ))
        .bind(state.to_string())
        .bind(id)
        .execute(&self.db)
        .await?;
        Ok(())
    }

    async fn update_project_asset(
        &self,
        id: Uuid,
        dto: UpdateProjectAssetDto,
    ) -> Result<ProjectAssetEntity, DbError> {
        let query = QueryBuilder::new("UPDATE project_assets SET");
        let update_count = 0;

        let (mut query, update_count) = if let Some(state) = dto.state {
            append_comma(query, "state", Some(state.to_string()), update_count)
        } else {
            (query, update_count)
        };

        if update_count == 0 {
            return Err(DbError::NoUpdate);
        }

        query.push(" WHERE id = ");
        query.push_bind(id);
        query.push(formatcp!(" RETURNING {}", PROJECT_ASSET_COLUMNS));

        Ok(query
            .build()
            .try_map(map_project_asset_entity)
            .fetch_one(&self.db)
            .await
            .map_err(map_sqlx_err)?)
    }

    async fn list_project_assets(
        &self,
        query: ListProjectAssetsQuery,
    ) -> Result<ProjectAssetListResults, DbError> {
        let filtered_query = if query.user_id.is_none()
            && query.project_id.is_none()
            && query.state.is_none()
            && query.content_type.is_none()
        {
            QueryBuilder::new(
                "SELECT *, COUNT(*) OVER (), CAST(SUM(size) OVER() as INT8) as total_usage FROM project_assets",
            )
        } else if let Some(user_id) = query.user_id.clone() {
            // Filter user_id for SUM, so we can return the correct asset usage for a user
            let q = QueryBuilder::new(
                "SELECT *, COUNT(*) OVER (), CAST((SELECT SUM(size) FROM project_assets WHERE",
            );
            let (mut q, _c) = append_and_eq(q, "user_id", option_string_to_uuid(Some(user_id)), 0);
            q.push(") as INT8) as total_usage FROM project_assets WHERE");
            q
        } else {
            QueryBuilder::new(
                "SELECT *, COUNT(*) OVER (), CAST(SUM(size) OVER() as INT8) as total_usage FROM project_assets WHERE",
            )
        };

        // Filter user_id
        let (filtered_query, count) = append_and_eq(
            filtered_query,
            "user_id",
            option_string_to_uuid(query.user_id),
            0,
        );
        // Filter project_id
        let (filtered_query, count) = append_and_eq(
            filtered_query,
            "project_id",
            option_string_to_uuid(query.project_id),
            count,
        );
        // Filter state
        let (filtered_query, count) = append_and_eq(
            filtered_query,
            "state",
            option_enum_to_string(query.state),
            count,
        );
        let (mut filtered_query, _count) = append_and_eq(
            filtered_query,
            "content_type",
            option_enum_to_string(query.content_type),
            count,
        );

        // ORDER BY
        let column = to_string(&query.column.unwrap_or(ProjectAssetSortColumn::CreatedAt))
            .map_err(|e| DbError::Serialize(e.to_string()))?;
        let direction = query.direction.unwrap_or(SortDirection::Desc);

        filtered_query = append_order_by(filtered_query, column, direction.to_string());
        filtered_query = append_limit_offset(filtered_query, query.from, query.to);

        let results = filtered_query
            .build()
            .try_map(map_project_asset_list_entity)
            .fetch_all(&self.db)
            .await?;
        let (results, total, total_usage) = project_asset_list_result(results);

        Ok(ProjectAssetListResults {
            total,
            total_usage,
            results,
        })
    }

    async fn delete_project_asset_by_id(&self, id: Uuid) -> Result<(), DbError> {
        sqlx::query(r#"DELETE FROM "project_assets" WHERE id = $1"#)
            .bind(id)
            .execute(&self.db)
            .await?;

        Ok(())
    }

    async fn get_total_asset_usage_by_user(&self, user_id: Uuid) -> Result<i64, DbError> {
        let sizes = sqlx::query(r#"SELECT size FROM "project_assets" WHERE user_id = $1"#)
            .bind(user_id)
            .try_map(|row: PgRow| row.try_get("size"))
            .fetch_all(&self.db)
            .await?;

        // Calculate the sum of sizes
        let total_size = sizes.iter().sum();

        Ok(total_size)
    }
}
