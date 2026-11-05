import { downloadFile } from "@/services/AdapterService";
import { useCallback, useState } from "react";

export function useDownload() {
  const [downloaded, setDownloaded] = useState(0);
  const [total, setTotal] = useState<number | null>(null);
  const [status, setStatus] = useState<
    "idle" | "downloading" | "done" | "error"
  >("idle");
  const [error, setError] = useState<string | null>(null);

  const start = useCallback(async (url: string, name: string) => {
    setStatus("downloading");
    setDownloaded(0);
    setTotal(null);
    setError(null);

    try {
      const dest = await downloadFile(url, name, (e) => {
        if (e.event === "started") setTotal(e.data.total);
        else if (e.event === "progress") setDownloaded(e.data.downloaded);
      });
      setStatus(dest ? "done" : "idle"); // null = dialog cancelled
    } catch (e) {
      setError(String(e)); // Rust's Err(String) arrives as the rejection value
      setStatus("error");
    }
  }, []);

  const percent = total ? Math.round((downloaded / total) * 100) : null;
  return { start, status, error, downloaded, total, percent };
}
