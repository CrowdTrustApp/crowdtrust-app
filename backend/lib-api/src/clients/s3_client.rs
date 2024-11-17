use crate::{error::api_error::ApiError, util::config::Config};
use reqwest::Url;
use rusty_s3::{Bucket, Credentials, S3Action, UrlStyle};
use std::time::Duration;
use tracing::warn;

#[derive(Clone)]
pub struct S3Client {
    credentials: Credentials,
    pub project_asset_bucket: Bucket,
}

impl S3Client {
    pub fn new(config: &Config) -> S3Client {
        let project_asset_name = config.s3_assets_bucket_name.clone();

        if config.s3_url.is_empty()
            || config.s3_secret_access_key.is_empty()
            || config.s3_access_key_id.is_empty()
            || project_asset_name.is_empty()
        {
            warn!("Missing S3 configuration, please check the following information is provided: S3_URL, S3_ACCESS_KEY_ID, S3_SECRET_ACCESS_KEY")
        }
        let endpoint: Url = config.s3_url.parse().expect("s3 endpoint is invalid");
        let path_style = UrlStyle::Path;
        let region = "auto";
        let project_asset_bucket =
            Bucket::new(endpoint.clone(), path_style, project_asset_name, region)
                .expect("project-asset bucket url is invalid");

        let credentials = Credentials::new(
            config.s3_access_key_id.clone(),
            config.s3_secret_access_key.clone(),
        );

        S3Client {
            credentials,
            project_asset_bucket,
        }
    }

    fn presign_put(
        &self,
        bucket: &Bucket,
        filename: &str,
        expires: u64,
        content_type: &str,
        size: String,
    ) -> Result<Url, ApiError> {
        // Sign a request
        let presigned_url_duration = Duration::from_secs(expires);
        let mut action = bucket.put_object(Some(&self.credentials), filename);

        let query = action.query_mut();
        query.insert("Content-Type", content_type);
        query.insert("Content-Length", size);

        Ok(action.sign(presigned_url_duration))
    }

    async fn delete_asset(&self, bucket: &Bucket, object_key: &str) -> Result<(), ApiError> {
        let delete_object = bucket.delete_object(Some(&self.credentials), &object_key);

        let expires_in = Duration::from_secs(600);
        let url = delete_object.sign(expires_in);

        match reqwest::Client::new().delete(url).send().await {
            Ok(res) => {
                if res.status().is_success() {
                    Ok(())
                } else {
                    let error_message = match res.text().await {
                        Ok(text) => {
                            format!("Delete asset fail: {}, Response: {}", object_key, text)
                        }
                        Err(_) => format!("Delete asset fail: {}", object_key),
                    };

                    Err(ApiError::internal_error().message(error_message))
                }
            }
            Err(err) => Err(ApiError::internal_error().message(format!(
                "Failed to send DELETE request: {}, {}",
                object_key, err
            ))),
        }
    }

    pub fn presign_put_project_asset(
        &self,
        filename: &str,
        expires: u64,
        content_type: &str,
        size: i64,
    ) -> Result<Url, ApiError> {
        self.presign_put(
            &self.project_asset_bucket,
            filename,
            expires,
            content_type,
            size.to_string(),
        )
    }

    pub async fn verify_project_asset(&self, object_key: &str) -> Result<bool, ApiError> {
        let head_object = self
            .project_asset_bucket
            .head_object(Some(&self.credentials), &object_key);

        let expires_in = Duration::from_secs(600);
        let url = head_object.sign(expires_in);

        match reqwest::Client::new().head(url).send().await {
            Ok(res) => Ok(res.status().is_success()),
            Err(err) => Err(ApiError::internal_error()
                .message("Failed to send HEAD request".to_string() + &err.to_string())),
        }
    }

    pub async fn delete_project_asset(&self, object_key: &str) -> Result<(), ApiError> {
        self.delete_asset(&self.project_asset_bucket, object_key)
            .await
    }
}
