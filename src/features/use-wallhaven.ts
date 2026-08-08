import WallhavenAPIService from "@/services/WallhavenAPIService";
import { CollectionsParams } from "@/types/core/CollectionsParams";
import { SearchParameters } from "@/types/core/SearchParameters";
import { SearchResponse } from "@/types/core/SearchResponse";
import { keepPreviousData, useInfiniteQuery, useQuery } from "@tanstack/react-query";

export const wallhavenQueryKeys = {
  all: () => ["wallhaven"],
  query: (params: Partial<SearchParameters>) => [...wallhavenQueryKeys.all(), params],
  collections: () => [...wallhavenQueryKeys.all(), "collections"]
  // collection: (id: string) => 
};

export function useWallhavenSearch(params: Partial<SearchParameters>) {
  return useInfiniteQuery({
    queryKey: wallhavenQueryKeys.query({ ...params }),
    queryFn: ({ pageParam }) =>
      WallhavenAPIService.wallpaperSearch({ ...params, page: pageParam }),
    placeholderData: keepPreviousData,
    getNextPageParam: (lastPage: SearchResponse) =>
      lastPage.meta.current_page + 1,
    initialPageParam: 1,
    select: (data) => ({
      pages: data.pages,
      wallpapers: data.pages.flatMap(p => p.data)
    })
  });
}

export function useUserCollections(params: CollectionsParams) {
  return useQuery({
    queryKey: wallhavenQueryKeys.collections(),
    queryFn: () => WallhavenAPIService.getUserCollections(params)
  })
}