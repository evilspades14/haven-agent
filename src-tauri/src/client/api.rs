use std::error::Error;

use reqwest::Client;

pub struct WallHavenAPIClient {
    client: Client,
    base_url: String,
    api_key: Option<String>
}

impl WallHavenAPIClient {
    pub fn build() -> Result<Self, Box<dyn Error>> {
        let base_url = String::from("https://wallhaven.cc/api");
        let client = Client::builder().build()?;
        Ok(Self {
            client,
            base_url,
            api_key: None
        })
    }

    pub fn set_api_key(&mut self, api_key: Option<String>) {
        self.api_key = api_key;
    }

    pub fn get_api_key(&self) -> Option<&str> {
        self.api_key.as_deref()
    }
}