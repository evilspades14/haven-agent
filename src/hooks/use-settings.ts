import { LazyStore } from "@tauri-apps/plugin-store";
import { useEffect, useState } from "react";

const store = new LazyStore("settings.json");

export function useSettings() {
  const [apiKey, setApiKey] = useState<string | null>(null);
  useEffect(() => {
    async function fetchApiKey() {
      const apiKey = await store.get<string>("api_key");
      if (apiKey) setApiKey(apiKey);
    }
    fetchApiKey();
  }, []);

  const updateApiKey = async (apiKey: string) => {
    store.set("api_key", apiKey);
    await store.save();
    setApiKey(apiKey)
  }

  return { apiKey, updateApiKey };
}
