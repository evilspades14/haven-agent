mod client;
mod state;
mod error;
use client::*;
use tauri::Manager;
use tokio::sync::Mutex;

use crate::state::AppState;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .setup(|app| {
            let state = Mutex::new(AppState::new());
            app.manage(state);
            Ok(())
        })
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![command::search])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
