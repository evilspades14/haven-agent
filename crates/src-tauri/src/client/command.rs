use crate::{error::CommandError, state::state::AppState};
use serde_json::Value;
use tauri::{command, State};
use tokio::sync::Mutex;

use crate::client::model::{SearchParameters, SearchResponse};

#[command]
pub async fn wallpaper_search(
    state: State<'_, Mutex<AppState>>,
    params: SearchParameters,
) -> Result<SearchResponse, CommandError> {
    let state = state.lock().await;
    state
        .wallhaven_client
        .wallpaper_search(params)
        .await
        .map_err(|e| e.into())
}
