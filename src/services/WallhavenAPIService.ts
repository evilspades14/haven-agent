import { CollectionsParams } from "@/types/core/CollectionsParams";
import { CollectionsResponse } from "@/types/core/CollectionsResponse";
import { ListCollectionParams } from "@/types/core/ListCollectionParams";
import { SearchParameters } from "@/types/core/SearchParameters";
import { SearchResponse } from "@/types/core/SearchResponse";
import { invoke } from "@tauri-apps/api/core";

const WallhavenAPIService = {
  async wallpaperSearch(params: Partial<SearchParameters>) {
    return await invoke<SearchResponse>("wallpaper_search", { params });
  },
  async getUserCollections(params: CollectionsParams) {
    return await invoke<CollectionsResponse>("user_collections", { params });
  },
  async listCollection(params: ListCollectionParams) {
    return await invoke<SearchResponse>("list_collection", params)
  }
};

export default WallhavenAPIService;
