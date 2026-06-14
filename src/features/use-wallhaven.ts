import WallhavenAPIService from "@/services/WallhavenAPIService";
import { SearchParameters } from "@/types/core/SearchParameters";
import { SearchResponse } from "@/types/core/SearchResponse";
import { defaultSearchParamters } from "@/types/default/defaultSearchParameters";
import {
  keepPreviousData,
  useInfiniteQuery,
  useQuery,
} from "@tanstack/react-query";
import { useState } from "react";

export const wallhavenQueryKeys = {
  all: () => ["search"],
  query: (params: SearchParameters) => [...wallhavenQueryKeys.all(), params],
};

export function useWallhavenSearch() {
  const [q, setQuery] = useState<string>("");

  const params = defaultSearchParamters();

  const result = useInfiniteQuery({
    queryKey: wallhavenQueryKeys.query({ ...params, q }),
    queryFn: ({ pageParam }) =>
      WallhavenAPIService.wallpaperSearch({ ...params, q, page: pageParam }),
    placeholderData: keepPreviousData,
    getNextPageParam: (lastPage: SearchResponse) =>
      lastPage.meta.current_page + 1,
    initialPageParam: 1,
  });

  function search(value: string) {
    setQuery(value.trim());
  }

  return { ...result, search };
}
