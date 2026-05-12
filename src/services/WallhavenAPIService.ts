import { SearchParameters } from "@/types/core/SearchParameters";
import { SearchResponse } from "@/types/core/SearchResponse";
import { invoke } from "@tauri-apps/api/core";

const WallhavenAPIService = {
  async search(params: SearchParameters) {
    return await invoke<SearchResponse>("search", { params });
  },
};

export default WallhavenAPIService;
