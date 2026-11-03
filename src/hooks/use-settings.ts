import { LazyStore } from "@tauri-apps/plugin-store";
import { useCallback, useEffect, useRef, useState } from "react";

const store = new LazyStore("settings.json", { autoSave: false });

export type SettingsKey = "apiKey" | "username"

type Updater<T> = T | ((prev: T) => T);

export function useStoreValue<T>(key: SettingsKey, defaultValue: T) {
  const [value, setValue] = useState<T>(defaultValue);
  const [ready, setReady] = useState(false);

  const valueRef = useRef(value);
  const defaultRef = useRef(defaultValue);

  const apply = useCallback((next: T) => {
    valueRef.current = next;
    setValue(next);
  }, []);

  useEffect(() => {
    let cancelled = false;
    let unlisten: (() => void) | undefined;

    (async () => {

      const un = await store.onKeyChange<T>(key, (v) => {
        if (!cancelled) apply(v ?? defaultRef.current);
      });
      if (cancelled) return un();
      unlisten = un;

      const stored = await store.get<T>(key);
      if (cancelled) return;
      apply(stored ?? defaultRef.current);
      setReady(true);
    })().catch(console.error);

    return () => {
      cancelled = true;
      unlisten?.();
    };
  }, [key, apply]);

  const update = useCallback(
    async (next: Updater<T>) => {
      const prev = valueRef.current;
      const resolved =
        typeof next === "function" ? (next as (p: T) => T)(prev) : next;

      apply(resolved);
      try {
        await store.set(key, resolved);
      } catch (e) {
        apply(prev);
        throw e;
      }
    },
    [key, apply]
  );

  return [value, update, ready] as const;
}