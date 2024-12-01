use std::sync::Arc;

use axum::async_trait;
use bigdecimal::BigDecimal;
use const_format::formatcp;
use lib_api::db::{
    db_error::{map_sqlx_err, DbError},
    util::{
        append_and_eq, append_comma, append_limit_offset, append_order_by, option_string_to_uuid,
    },
};
use lib_types::{
    dto::{
        pledge::list_pledges_dto::{ListPledgesQuery, PledgeSortColumn},
        sort_direction::SortDirection,
    },
    entity::pledge_entity::{
        PledgeEntity, PledgeEntityRelations, PledgeItemEntity, PledgeListResults,
    },
    shared::project::{BlockchainStatus, PaymentCurrency},
};
use serde::{Deserialize, Serialize};
use serde_json::to_string;
use sqlx::{postgres::PgRow, PgPool, Postgres, QueryBuilder, Row, Transaction};
use uuid::Uuid;

pub type DynPledgeRepo = Arc<dyn PledgeRepoTrait + Send + Sync>;

#[derive(Debug, Deserialize, Serialize, sqlx::Type)]
pub struct PledgeCreateProps {
    pub user_id: Uuid,
    pub project_id: Uuid,
    pub pledge_items: Vec<PledgeItemCreateProps>,
}

#[derive(Debug, Clone, Deserialize, Serialize, sqlx::Type)]
pub struct PledgeItemCreateProps {
    pub reward_id: Uuid,
    pub quantity: i32,
    pub paid_price: BigDecimal,
    pub paid_currency: PaymentCurrency,
}

#[derive(Debug, Deserialize, Serialize, sqlx::Type)]
pub struct PledgeUpdateProps {
    pub comment: Option<String>,
    pub blockchain_status: Option<BlockchainStatus>,
    pub transaction_hash: Option<String>,
}

#[async_trait]
pub trait PledgeRepoTrait {
    fn get_db(&self) -> &PgPool;
    async fn get_pledge_by_id(&self, id: Uuid) -> Result<PledgeEntity, DbError>;
    async fn get_pledge_relations_by_id(&self, id: Uuid) -> Result<PledgeEntityRelations, DbError>;
    async fn update_pledge(
        &self,
        id: Uuid,
        props: PledgeUpdateProps,
    ) -> Result<PledgeEntity, DbError>;
    async fn back_project(
        &self,
        tx: &mut Transaction<'_, Postgres>,
        props: PledgeCreateProps,
    ) -> Result<PledgeEntity, DbError>;
    async fn list_pledges(&self, query: ListPledgesQuery) -> Result<PledgeListResults, DbError>;
}

pub struct PledgeRepo {
    pub db: PgPool,
}

const PLEDGE_COLUMNS: &str = formatcp!(
    r#"{p}.id, {p}.user_id, {p}.project_id, {p}.comment, {p}.created_at, {p}.updated_at"#,
    p = "pledges"
);

const PLEDGE_ITEM_COLUMNS: &str = formatcp!(
    r#"{p}.id, {p}.pledge_id, {p}.reward_id, {p}.quantity, {p}.paid_price, {p}.paid_currency, {p}.blockchain_status, {p}.transaction_hash, {p}.created_at, {p}.updated_at"#,
    p = "pledge_items"
);

const PLEDGE_RELATION_COLUMNS: &str = formatcp!(
    r#"{p}, {pi}.id as pi_id, {pi}.pledge_id as pi_pledge_id, {pi}.reward_id as pi_reward_id, {pi}.quantity as pi_quantity, {pi}.paid_price as pi_paid_price, {pi}.paid_currency as pi_paid_currency, {pi}.blockchain_status as pi_blockchain_status, {pi}.transaction_hash as pi_transaction_hash, {pi}.created_at as pi_created_at, {pi}.updated_at as pi_updated_at"#,
    p = PLEDGE_COLUMNS,
    pi = "pi"
);

fn map_pledge_entity(row: PgRow) -> Result<PledgeEntity, sqlx::Error> {
    Ok(PledgeEntity {
        id: row.try_get("id")?,
        user_id: row.try_get("user_id")?,
        project_id: row.try_get("project_id")?,
        comment: row.try_get("comment")?,
        created_at: row.try_get("created_at")?,
        updated_at: row.try_get("updated_at")?,
    })
}

fn map_pledge_item_entity(row: PgRow) -> Result<PledgeItemEntity, sqlx::Error> {
    Ok(PledgeItemEntity {
        id: row.try_get("id")?,
        pledge_id: row.try_get("pledge_id")?,
        reward_id: row.try_get("reward_id")?,
        quantity: row.try_get("quantity")?,
        paid_price: row.try_get("paid_price")?,
        paid_currency: row.try_get_unchecked("paid_currency")?,
        blockchain_status: row.try_get_unchecked("blockchain_status")?,
        transaction_hash: row.try_get("transaction_hash")?,
        created_at: row.try_get("created_at")?,
        updated_at: row.try_get("updated_at")?,
    })
}

fn map_pledge_item_entity_relation(row: &PgRow) -> Result<PledgeItemEntity, sqlx::Error> {
    Ok(PledgeItemEntity {
        id: row.try_get("pi_id")?,
        pledge_id: row.try_get("pi_pledge_id")?,
        reward_id: row.try_get("pi_reward_id")?,
        quantity: row.try_get("pi_quantity")?,
        paid_price: row.try_get("pi_paid_price")?,
        paid_currency: row.try_get_unchecked("pi_paid_currency")?,
        blockchain_status: row.try_get_unchecked("pi_blockchain_status")?,
        transaction_hash: row.try_get("pi_transaction_hash")?,
        created_at: row.try_get("pi_created_at")?,
        updated_at: row.try_get("pi_updated_at")?,
    })
}

fn map_pledge_relation_entity(row: PgRow) -> Result<PledgeEntityRelations, sqlx::Error> {
    let item_result = map_pledge_item_entity_relation(&row);
    let pledge_items = if let Ok(item) = item_result {
        vec![item]
    } else {
        vec![]
    };
    Ok(PledgeEntityRelations {
        id: row.try_get("id")?,
        user_id: row.try_get("user_id")?,
        project_id: row.try_get("project_id")?,
        comment: row.try_get("comment")?,
        pledge_items,
        created_at: row.try_get("created_at")?,
        updated_at: row.try_get("updated_at")?,
    })
}

#[async_trait]
impl PledgeRepoTrait for PledgeRepo {
    fn get_db(&self) -> &PgPool {
        &self.db
    }

    async fn get_pledge_by_id(&self, id: Uuid) -> Result<PledgeEntity, DbError> {
        Ok(sqlx::query(formatcp!(
            "SELECT {} FROM \"pledges\" WHERE id = $1",
            PLEDGE_COLUMNS
        ))
        .bind(id)
        .try_map(map_pledge_entity)
        .fetch_one(&self.db)
        .await
        .map_err(map_sqlx_err)?)
    }

    async fn get_pledge_relations_by_id(&self, id: Uuid) -> Result<PledgeEntityRelations, DbError> {
        let rows = sqlx::query(formatcp!(
            "SELECT {} FROM \"pledges\" pledges
            LEFT OUTER JOIN pledge_items pi on pi.pledge_id = pledges.id
            WHERE pledges.id = $1",
            PLEDGE_RELATION_COLUMNS
        ))
        .bind(id)
        .fetch_all(&self.db)
        .await
        .map_err(map_sqlx_err)?;
        let mut row_iter = rows.into_iter();

        let first = (&mut row_iter)
            .take(1)
            .nth(0)
            .ok_or(DbError::EntityNotFound())?;
        let mut pledge = map_pledge_relation_entity(first)?;
        for item in row_iter {
            pledge
                .pledge_items
                .push(map_pledge_item_entity_relation(&item)?);
        }
        Ok(pledge)
    }

    async fn update_pledge(
        &self,
        id: Uuid,
        props: PledgeUpdateProps,
    ) -> Result<PledgeEntity, DbError> {
        let query = QueryBuilder::new("UPDATE pledges SET");
        let update_count = 0;

        let (query, update_count) = append_comma(query, "comment", props.comment, update_count);

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
        query.push(formatcp!(" RETURNING {}", PLEDGE_COLUMNS));

        Ok(query
            .build()
            .try_map(map_pledge_entity)
            .fetch_one(&self.db)
            .await
            .map_err(|e| match e {
                sqlx::Error::RowNotFound => DbError::EntityNotFound(),
                _ => DbError::Query(e.to_string()),
            })?)
    }

    async fn back_project(
        &self,
        tx: &mut Transaction<'_, Postgres>,
        props: PledgeCreateProps,
    ) -> Result<PledgeEntity, DbError> {
        let pledge = sqlx::query(formatcp!(
            // language=PostgreSQL
            r#"
              INSERT INTO "pledges" (user_id, project_id)
              values ($1, $2)
              RETURNING {}
            "#,
            PLEDGE_COLUMNS
        ))
        .bind(props.user_id)
        .bind(props.project_id)
        .try_map(map_pledge_entity)
        .fetch_one(tx.as_mut())
        .await
        .map_err(|e| match e {
            _ => DbError::Query(e.to_string()),
        })?;

        for item in props.pledge_items.into_iter() {
            sqlx::query(formatcp!(
                // language=PostgreSQL
                r#"
                  INSERT INTO "pledge_items" (pledge_id, reward_id, quantity, paid_price, paid_currency, blockchain_status)
                  values ($1, $2, $3, $4, $5, $6)
                  RETURNING {}
                "#,
                PLEDGE_ITEM_COLUMNS
            ))
            .bind(pledge.id.clone())
            .bind(item.reward_id)
            .bind(item.quantity)
            .bind(item.paid_price)
            .bind(item.paid_currency.to_string())
            .bind(BlockchainStatus::None.to_string())
            .try_map(map_pledge_item_entity)
            .fetch_one(tx.as_mut())
            .await
            .map_err(|e| match e {
                _ => DbError::Query(e.to_string()),
            })?;
        }
        Ok(pledge)
    }

    async fn list_pledges(&self, query: ListPledgesQuery) -> Result<PledgeListResults, DbError> {
        let mut filtered_query = QueryBuilder::new(format!(
            "SELECT {}, count FROM (SELECT *, COUNT(*) OVER () as count from \"pledges\"",
            PLEDGE_RELATION_COLUMNS
        ));

        if query.user_id.is_some() || query.project_id.is_some() {
            filtered_query.push(" WHERE");
        }

        // Filter user_id
        let (filtered_query, count) = append_and_eq(
            filtered_query,
            "user_id",
            option_string_to_uuid(query.user_id),
            0,
        );
        // Filter project_id
        let (mut filtered_query, _) = append_and_eq(
            filtered_query,
            "project_id",
            option_string_to_uuid(query.project_id),
            count,
        );
        // ORDER BY
        let column = to_string(&query.column.unwrap_or(PledgeSortColumn::CreatedAt))
            .map_err(|e| DbError::Serialize(e.to_string()))?;
        let direction = query.direction.unwrap_or(SortDirection::Desc);

        filtered_query.push(
            ") as pledges LEFT OUTER JOIN \"pledge_items\" pi on pledge_items.pledge_id = pledges.id",
        );

        filtered_query
            .push(" GROUP BY pledges.id, pledges.user_id, pledges.project_id, pledges.comment, pledges.created_at, pledges.count, pledges.updated_at, pi.id");
        filtered_query = append_order_by(filtered_query, column, direction.to_string());
        filtered_query = append_limit_offset(filtered_query, query.from, query.to);

        let rows = filtered_query.build().fetch_all(&self.db).await?;
        let mut pledges: Vec<PledgeEntityRelations> = vec![];
        let mut pledge: Option<PledgeEntityRelations> = None;
        let mut count: Option<i64> = None;

        for row in rows.into_iter() {
            if count.is_none() {
                count = Some(row.try_get("count")?);
            }
            let id = row.try_get::<Uuid, &str>("id")?;
            if let Some(mut prev) = pledge {
                if prev.id == id {
                    prev.pledge_items
                        .push(map_pledge_item_entity_relation(&row)?);
                    pledge = Some(prev);
                } else {
                    pledges.push(prev);
                    pledge = Some(map_pledge_relation_entity(row)?);
                }
            } else {
                pledge = Some(map_pledge_relation_entity(row)?)
            }
        }
        if let Some(last_pledge) = pledge {
            pledges.push(last_pledge);
        }

        Ok(PledgeListResults {
            total: count.unwrap_or(pledges.len() as i64),
            results: pledges,
        })
    }
}
