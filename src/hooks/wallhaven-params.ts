import { SearchParameters } from "@/types/core/SearchParameters";
import { defaultSearchParameters } from "@/types/default/defaultSearchParameters";
import { create } from "zustand";

export type WallhavenClientParamsStoreState = {
  params: Partial<SearchParameters>;
  updateParams: (update: Partial<SearchParameters>) => void;
};

const useWallhavenClientParamsStore = create<WallhavenClientParamsStoreState>(
  (set) => ({
    params: { ...defaultSearchParameters() },
    updateParams: (update) =>
      set((prev) => ({ params: { ...prev.params, ...update } })),
  }),
);

export default useWallhavenClientParamsStore;
