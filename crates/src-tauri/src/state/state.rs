use sqlx::SqlitePool;

use crate::{
    client::api::{WallHavenAPIClient, WallHavenAPIClientBuilder}, db::init_db, error::SafeError
};

pub struct AppState {
    pub wallhaven_client: WallHavenAPIClient,
    pub db: SqlitePool
}

impl AppState {
    pub fn new() -> Result<Self, SafeError> {
        let builder = WallHavenAPIClientBuilder::new("https://wallhaven.cc/api", None);
        let wallhaven_client = builder.build()?;
        let pool = tokio::task::spawn_blocking(|| {
            init_db(app).await
        });
        Ok(Self { wallhaven_client })
    }
}
