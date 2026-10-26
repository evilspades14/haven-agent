use sqlx::SqlitePool;
use wallhaven::client::api::WallHavenAPIClient;

pub struct AppState {
    pub wallhaven_client: WallHavenAPIClient,
    pub db: SqlitePool,
}
