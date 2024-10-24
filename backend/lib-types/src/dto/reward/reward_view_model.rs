use chrono::{DateTime, Utc};
use serde::Serialize;
use uuid::Uuid;

use crate::{dto::project::get_project_dto::serialize_big, entity::reward_entity::RewardEntity};

#[derive(Serialize)]
pub struct RewardViewModel {
    pub id: Uuid,
    pub name: String,
    pub description: String,
    pub delivery_time: i64,
    pub price: String,
    pub backer_limit: i32,
    pub backer_count: i32,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

pub fn to_api_response(reward_entity: RewardEntity) -> RewardViewModel {
    return RewardViewModel {
        id: reward_entity.id,
        name: reward_entity.name,
        description: reward_entity.description,
        delivery_time: reward_entity.delivery_time,
        price: serialize_big(&reward_entity.price),
        backer_limit: reward_entity.backer_limit,
        backer_count: reward_entity.backer_count,
        created_at: reward_entity.created_at,
        updated_at: reward_entity.updated_at,
    };
}
