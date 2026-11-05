import { DownloadEvent } from "@/types/core/DownloadEvent";
import { Channel, invoke } from "@tauri-apps/api/core";
import { save } from '@tauri-apps/plugin-dialog';

export async function downloadFile(
  url: string,
  suggestedName: string,
  onEvent: (e: DownloadEvent) => void,
): Promise<string | null> {
  const dest = await save({ defaultPath: suggestedName });
  if (!dest) return null;

  const channel = new Channel<DownloadEvent>();
  channel.onmessage = onEvent;

  await invoke('download_file', { url, dest, onEvent: channel });
  return dest;
}