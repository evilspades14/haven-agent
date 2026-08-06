use tauri::{command, State};
use tokio::sync::Mutex;

use crate::{error::CommandError, state::state::AppState};
