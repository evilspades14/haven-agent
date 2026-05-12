use std::error::Error;

use crate::{
    client::api::{WallHavenAPIClient, WallHavenAPIClientBuilder},
    error::SafeError,
};

pub struct AppState {
    pub wallhaven_client: WallHavenAPIClient,
}

impl AppState {
    pub fn new() -> Result<Self, SafeError> {
        let builder = WallHavenAPIClientBuilder::new("https://wallhaven.cc", None);
        let wallhaven_client = builder.build()?;
        Ok(Self { wallhaven_client })
    }
}
