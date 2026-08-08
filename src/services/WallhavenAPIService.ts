import { CollectionsParams } from "@/types/core/CollectionsParams";
import { SearchParameters } from "@/types/core/SearchParameters";
import { SearchResponse } from "@/types/core/SearchResponse";
import { invoke } from "@tauri-apps/api/core";

const WallhavenAPIService = {
  async wallpaperSearch(params: Partial<SearchParameters>) {
    return await invoke<SearchResponse>("wallpaper_search", { params });
  },
  async getUserCollections(params: CollectionsParams) {
    return await invoke<SearchResponse>("wallpaper_search", { params });
  }
};

export default WallhavenAPIService;
