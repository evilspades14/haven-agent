mod client;
mod db;
mod error;
mod state;
use client::*;
use tauri::Manager;
use tokio::sync::Mutex;

use crate::{client::api::WallHavenAPIClientBuilder, db::init_db, state::state::AppState};

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
            let builder = WallHavenAPIClientBuilder::new("https://wallhaven.cc/api", None);
            let wallhaven_client = builder.build().expect("Failed to construct API Client!");
            let pool =
                tauri::async_runtime::block_on(init_db(app)).expect("Failed to intialize DB!");
            let state = AppState {
                db: pool,
                wallhaven_client,
            };
            app.manage(Mutex::new(state));
            Ok(())
        })
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![command::wallpaper_search])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
