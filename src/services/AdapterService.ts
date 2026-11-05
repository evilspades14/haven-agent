import { DownloadEvent } from "@/types/core/DownloadEvent";
import { Channel } from "@tauri-apps/api/core";
import { save } from '@tauri-apps/plugin-dialog';

async function download(url: string, suggestedName: string) {
  const dest = await save({ defaultPath: suggestedName });
  if (!dest) return;

  const channel = new Channel<DownloadEvent>();
  channel.onmessage = (msg) => {
    if (msg.event === 'progress') setProgress(msg.data.downloaded);
  };

  await invoke('download_file', { url, dest, onEvent: channel });
}