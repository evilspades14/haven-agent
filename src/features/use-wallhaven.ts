import WallhavenAPIService from "@/services/WallhavenAPIService";
import { ListCollectionParams } from "@/types/core/ListCollectionParams";
import { SearchParameters } from "@/types/core/SearchParameters";
import { SearchResponse } from "@/types/core/SearchResponse";
import {
  keepPreviousData,
  useInfiniteQuery,
  useQuery,
} from "@tanstack/react-query";

export const wallhavenQueryKeys = {
  all: () => ["wallhaven"],
  query: (params: Partial<SearchParameters>) => [
    ...wallhavenQueryKeys.all(),
    params,
  ],
  collections: () => [...wallhavenQueryKeys.all(), "collections"],
  collection: (params: ListCollectionParams) => [
    ...wallhavenQueryKeys.collections(),
    params,
  ],
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
      wallpapers: data.pages.flatMap((p) => p.data),
    }),
  });
}

export function useUserCollections({ apiKey }: { apiKey: string | undefined }) {
  return useQuery({
    queryKey: wallhavenQueryKeys.collections(),
    queryFn: () => WallhavenAPIService.getUserCollections({ apikey: apiKey! }),
    enabled: !!apiKey,
  });
}

export function useCollection(params: ListCollectionParams) {
  return useQuery({
    queryKey: wallhavenQueryKeys.collection(params),
    queryFn: () => WallhavenAPIService.listCollection(params),
    enabled: !!params.apikey && !!params.collection_id && !!params.username,
  });
}
