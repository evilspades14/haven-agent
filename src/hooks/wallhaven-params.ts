import { SearchParameters } from "@/types/core/SearchParameters";
import { defaultSearchParamters } from "@/types/default/defaultSearchParameters";
import { create } from "zustand";

export type WallhavenClientParamsStoreState = {
  params: Partial<SearchParameters>;
  updateParams: (update: Partial<SearchParameters>) => void;
};

const useWallhavenClientParamsStore = create<WallhavenClientParamsStoreState>(
  (set) => ({
    params: { ...defaultSearchParamters() },
    updateParams: (update) =>
      set((prev) => ({ params: { ...prev.params, ...update } })),
  }),
);

export default useWallhavenClientParamsStore;
