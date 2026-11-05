use futures_util::StreamExt;
use serde::Serialize;
use tauri::ipc::Channel;
use tokio::io::AsyncWriteExt;
use ts_rs::TS;

#[derive(Clone, Serialize, TS)]
#[serde(rename_all = "camelCase", tag = "event", content = "data")]
#[ts(export)]
pub enum DownloadEvent {
    Started { total: Option<u64> },
    Progress { downloaded: u64 },
    Finished,
}

#[tauri::command]
pub async fn download_file(
    url: String,
    dest: String,
    on_event: Channel<DownloadEvent>,
) -> Result<(), String> {
    let resp = reqwest::get(&url)
        .await
        .and_then(|r| r.error_for_status())
        .map_err(|e| e.to_string())?;

    on_event
        .send(DownloadEvent::Started { total: resp.content_length() })
        .map_err(|e| e.to_string())?;

    // Write to a temp file, then rename, so a failed download never leaves a corrupt file
    let tmp = format!("{dest}.part");
    let mut file = tokio::fs::File::create(&tmp).await.map_err(|e| e.to_string())?;
    let mut stream = resp.bytes_stream();
    let mut downloaded = 0u64;

    let result: Result<(), String> = async {
        while let Some(chunk) = stream.next().await {
            let chunk = chunk.map_err(|e| e.to_string())?;
            file.write_all(&chunk).await.map_err(|e| e.to_string())?;
            downloaded += chunk.len() as u64;
            let _ = on_event.send(DownloadEvent::Progress { downloaded });
        }
        file.flush().await.map_err(|e| e.to_string())
    }
    .await;

    if let Err(e) = result {
        let _ = tokio::fs::remove_file(&tmp).await;
        return Err(e);
    }

    tokio::fs::rename(&tmp, &dest).await.map_err(|e| e.to_string())?;
    let _ = on_event.send(DownloadEvent::Finished);
    Ok(())
}