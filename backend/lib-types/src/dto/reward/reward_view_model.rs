use chrono::{DateTime, Utc};
use serde::Serialize;
use uuid::Uuid;

use crate::{
    dto::project::get_project_dto::serialize_big, entity::reward_entity::RewardEntity,
    shared::asset::AssetContentType,
};

#[derive(Serialize)]
pub struct RewardViewModel {
    pub id: Uuid,
    pub name: String,
    pub description: String,
    pub delivery_time: i64,
    pub price: String,
    pub backer_limit: i32,
    pub backer_count: i32,
    pub image: Option<RewardAssetViewModelRelation>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Serialize)]
pub struct RewardAssetViewModelRelation {
    pub id: Uuid,
    pub project_id: Uuid,
    pub size: i64,
    pub content_type: AssetContentType,
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
        image: reward_entity.image.and_then(|image| {
            Some(RewardAssetViewModelRelation {
                id: image.id,
                project_id: image.project_id,
                size: image.size,
                content_type: image.content_type,
            })
        }),
        created_at: reward_entity.created_at,
        updated_at: reward_entity.updated_at,
    };
}
