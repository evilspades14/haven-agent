use std::error::Error;

use reqwest::Client;

pub struct WallHavenAPIClient {
    client: Client,
    base_url: String,
    api_key: Option<String>,
}

impl WallHavenAPIClient {
    pub fn search(&self) {

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

    pub fn build(self) -> Result<WallHavenAPIClient, Box<dyn Error>> {
        let base_url = String::from("https://wallhaven.cc/api");
        let client = Client::builder().build()?;
        Ok(WallHavenAPIClient {
            client,
            base_url,
            api_key: self.api_key,
        })
    }

    pub fn set_api_key(&mut self, api_key: Option<String>) {
        self.api_key = api_key;
    }

    pub fn get_api_key(&self) -> Option<&str> {
        self.api_key.as_deref()
    }
}
