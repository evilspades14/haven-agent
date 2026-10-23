use std::time::Duration;

use reqwest::Client;

use crate::{
    client::model::{CollectionsParams, CollectionsResponse, SearchParameters, SearchResponse},
    error::SafeError,
};
pub struct WallHavenAPIClient {
    client: Client,
    base_url: String,
}

impl WallHavenAPIClient {
    pub async fn wallpaper_search(
        &self,
        params: SearchParameters,
    ) -> Result<SearchResponse, SafeError> {
        let path = "/v1/search";
        let result = self
            .client
            .get(format!("{}{}", self.base_url, path))
            .query(&params)
            .send()
            .await?;
        let data = result.json::<SearchResponse>().await?;
        Ok(data)
    }

    pub async fn wallpaper_info(&self, id: String) -> Result<SearchResponse, SafeError> {
        let path = format!("{}/{}", "/w", id);
        let result = self
            .client
            .get(format!("{}{}", self.base_url, path))
            .send()
            .await?;
        let data = result.json::<SearchResponse>().await?;
        Ok(data)
    }

    pub async fn user_collections(
        &self,
        params: CollectionsParams,
    ) -> Result<CollectionsResponse, SafeError> {
        let path = "/v1/collections";
        let result = self
            .client
            .get(format!("{}{}", self.base_url, path))
            .query(&params)
            .send()
            .await?;
        let data = result.json::<CollectionsResponse>().await?;
        Ok(data)
    }
}

pub struct WallHavenAPIClientBuilder {
    base_url: String,
}

impl WallHavenAPIClientBuilder {
    pub fn new(base_url: impl Into<String>) -> Self {
        WallHavenAPIClientBuilder {
            base_url: base_url.into(),
        }
    }

    pub fn build(self) -> Result<WallHavenAPIClient, SafeError> {
        let client = Client::builder().timeout(Duration::from_secs(20)).build()?;
        Ok(WallHavenAPIClient {
            client,
            base_url: self.base_url,
        })
    }
}
