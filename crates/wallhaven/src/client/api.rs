use std::{num::NonZeroU32, sync::Arc, time::Duration};

use governor::{
    Quota, RateLimiter,
    clock::DefaultClock,
    state::{InMemoryState, NotKeyed},
};
use moka::sync::Cache;
use reqwest::Client;
use scraper::{Html, Selector};
use serde_json::json;

use crate::{
    client::model::{
        CollectionsParams, CollectionsResponse, ListCollectionParams, SearchParameters,
        SearchResponse, SettingsParams, SettingsResponse,
    },
    error::SafeError,
};

const WEB: &str = "https://wallhaven.cc";
const API: &str = "https://wallhaven.cc/api";

pub struct WallHavenAPIClient {
    client: Client,
    search_cache: Cache<SearchParameters, SearchResponse>,
    detail_cache: Cache<String, SearchResponse>,
    limiter: Arc<RateLimiter<NotKeyed, InMemoryState, DefaultClock>>,
}

impl WallHavenAPIClient {
    pub async fn wallpaper_search(
        &self,
        params: SearchParameters,
    ) -> Result<SearchResponse, SafeError> {
        self.limiter.until_ready().await;
        match self.search_cache.get(&params) {
            Some(data) => Ok(data),
            None => {
                let path = "/v1/search";
                let result = self
                    .client
                    .get(format!("{}{}", API, path))
                    .query(&params)
                    .send()
                    .await?;
                let data = result.json::<SearchResponse>().await?;
                self.search_cache.insert(params, data.clone());
                Ok(data)
            }
        }
    }

    pub async fn wallpaper_info(&self, id: String) -> Result<SearchResponse, SafeError> {
        self.limiter.until_ready().await;
        match self.detail_cache.get(&id) {
            Some(detail) => Ok(detail),
            None => {
                let path = format!("{}/{}", "/w", id);
                let result = self.client.get(format!("{}{}", API, path)).send().await?;
                let data = result.json::<SearchResponse>().await?;
                self.detail_cache.insert(id, data.clone());
                Ok(data)
            }
        }
    }

    pub async fn user_collections(
        &self,
        params: CollectionsParams,
    ) -> Result<CollectionsResponse, SafeError> {
        self.limiter.until_ready().await;
        let path = "/v1/collections";
        let result = self
            .client
            .get(format!("{}{}", API, path))
            .query(&params)
            .send()
            .await?;
        let data = result.json::<CollectionsResponse>().await?;
        Ok(data)
    }

    pub async fn list_collection(
        &self,
        params: ListCollectionParams,
    ) -> Result<SearchResponse, SafeError> {
        self.limiter.until_ready().await;
        let ListCollectionParams {
            username,
            api_key,
            collection_id,
        } = params;
        let path = format!("/v1/collections/{username}/{collection_id}");
        let query = json!({
            "apikey": api_key
        });
        let result = self
            .client
            .get(format!("{}{}", API, path))
            .query(&query)
            .send()
            .await?;
        let data = result.json::<SearchResponse>().await?;
        Ok(data)
    }

    pub async fn user_settings(
        &self,
        params: SettingsParams,
    ) -> Result<SettingsResponse, SafeError> {
        self.limiter.until_ready().await;
        let path = "/v1/settings";
        let result = self
            .client
            .get(format!("{}{}", API, path))
            .query(&params)
            .send()
            .await?;
        let data = result.json::<SettingsResponse>().await?;
        Ok(data)
    }

    async fn csrf_token(&self, path: &str) -> anyhow::Result<String> {
        let html = self
            .client
            .get(format!("{WEB}{path}"))
            .send()
            .await?
            .text()
            .await?;
        let doc = Html::parse_document(&html);
        // selector is a guess: check where the token actually lives
        let sel = Selector::parse("meta[name=csrf-token]").unwrap();
        let tok = doc
            .select(&sel)
            .next()
            .and_then(|e| e.value().attr("content"))
            .ok_or_else(|| anyhow::anyhow!("csrf token not found"))?;
        Ok(tok.to_string())
    }

    pub async fn add_to_collection(&self, wp_id: &str, collection_id: u64) -> anyhow::Result<()> {
        let token = self.csrf_token(&format!("/w/{wp_id}")).await?;
        // method, path, and body: copy from your HAR capture
        let _resp = self
            .client
            .post(format!("{WEB}/REPLACE_WITH_CAPTURED_PATH"))
            .header("X-CSRF-TOKEN", token)
            .form(&[
                ("wallpaper", wp_id),
                ("collection", &collection_id.to_string()),
            ])
            .send()
            .await?
            .error_for_status()?;
        Ok(())
    }
}

pub struct WallHavenAPIClientBuilder;

impl WallHavenAPIClientBuilder {
    pub fn new() -> Self {
        WallHavenAPIClientBuilder {}
    }

    pub fn build(self) -> Result<WallHavenAPIClient, SafeError> {
        let client = Client::builder().timeout(Duration::from_secs(20)).build()?;
        let search_cache = Cache::builder()
            .max_capacity(64 * 1024 * 1024)
            .time_to_live(Duration::from_secs(60))
            .build();
        let detail_cache = Cache::builder()
            .max_capacity(64 * 1024 * 1024)
            .time_to_live(Duration::from_secs(60))
            .build();
        let limiter = Arc::new(RateLimiter::direct(Quota::per_minute(
            NonZeroU32::new(45).unwrap(),
        )));
        Ok(WallHavenAPIClient {
            client,
            search_cache,
            detail_cache,
            limiter,
        })
    }
}
