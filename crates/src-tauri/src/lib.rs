mod client;
mod error;
mod state;
mod db;
use client::*;
use tauri::Manager;
use tokio::sync::Mutex;

use crate::state::state::AppState;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_sql::Builder::new().build())
        .plugin(
            tauri_plugin_log::Builder::new()
                .level(tauri_plugin_log::log::LevelFilter::Debug)
                .build(),
        )
        .setup(|app| {
            let state = AppState::new().expect("Failed to initialize app state!");
            app.manage(Mutex::new(state));
            Ok(())
        })
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![command::wallpaper_search])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
