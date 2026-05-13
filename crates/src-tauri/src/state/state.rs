use sqlx::SqlitePool;

use crate::client::api::WallHavenAPIClient;

pub struct AppState {
    pub wallhaven_client: WallHavenAPIClient,
    pub db: SqlitePool,
}
