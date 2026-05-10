use std::error::Error;

use reqwest::{Client, Response};

use crate::{client::model::{SearchParameters, SearchResponse}, error::SafeError};
pub struct WallHavenAPIClient {
    client: Client,
    base_url: String,
    api_key: Option<String>,
}

impl WallHavenAPIClient {
    pub async fn search(&self, params: SearchParameters) -> Result<SearchResponse, SafeError> {
        let path = "/wallpapers";
        let result = self.client
            .get(format!("{}{}", self.base_url, path))
            .query(&params)
            .send()
            .await?;
        let data = result.json::<SearchResponse>().await?;
        Ok(data)
    }

    pub fn set_api_key(&mut self, api_key: Option<String>) {
        self.api_key = api_key;
    }

    pub fn get_api_key(&self) -> Option<&str> {
        self.api_key.as_deref()
    }
}

pub struct WallHavenAPIClientBuilder {
    base_url: String,
    api_key: Option<String>,
}

impl WallHavenAPIClientBuilder {
    pub fn new(base_url: impl Into<String>, api_key: impl Into<Option<String>>) -> Self {
        WallHavenAPIClientBuilder {
            base_url: base_url.into(),
            api_key: api_key.into(),
        }
    }

    pub fn build(self) -> Result<WallHavenAPIClient, SafeError> {
        let base_url = String::from("https://wallhaven.cc/api");
        let client = Client::builder().build()?;
        Ok(WallHavenAPIClient {
            client,
            base_url,
            api_key: self.api_key,
        })
    }
}
