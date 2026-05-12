use std::error::Error;

use crate::error::CommandError;
use tauri::{command, State};
use tokio::sync::Mutex;

use crate::{
    client::model::{SearchParameters, SearchResponse},
    state::AppState,
};

#[command]
pub async fn search(
    state: State<'_, Mutex<AppState>>,
    params: SearchParameters,
) -> Result<SearchResponse, CommandError> {
    let state = state.lock().await;
    state
        .wallhaven_client
        .search(params)
        .await
        .map_err(|e| e.into())
}

#[command]
pub async fn update_api_key(
    state: State<'_, Mutex<AppState>>,
    api_key: Option<String>,
) -> Result<(), CommandError> {
    let mut state = state.lock().await;
    state.wallhaven_client.set_api_key(api_key);
    Ok(())
}
