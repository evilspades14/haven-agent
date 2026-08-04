import WallhavenAPIService from "@/services/WallhavenAPIService";
import { SearchParameters } from "@/types/core/SearchParameters";
import { SearchResponse } from "@/types/core/SearchResponse";
import { keepPreviousData, useInfiniteQuery } from "@tanstack/react-query";

export const wallhavenQueryKeys = {
  all: () => ["search"],
  query: (params: Partial<SearchParameters>) => [...wallhavenQueryKeys.all(), params],
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
