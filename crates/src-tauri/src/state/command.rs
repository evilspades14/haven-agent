use tauri::{command, State};
use tokio::sync::Mutex;

use crate::{error::CommandError, state::state::AppState};

#[command]
pub async fn update_api_key(
    state: State<'_, Mutex<AppState>>,
    api_key: Option<String>,
) -> Result<(), CommandError> {
    let mut state = state.lock().await;
    state.wallhaven_client.set_api_key(api_key);
    Ok(())
}
