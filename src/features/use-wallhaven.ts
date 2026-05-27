import WallhavenAPIService from "@/services/WallhavenAPIService";
import { SearchParameters } from "@/types/core/SearchParameters";
import { defaultSearchParamters } from "@/types/default/defaultSearchParameters";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useReducer, useState } from "react";

export const wallhavenQueryKeys = {
  all: () => ["search"],
  query: (params: SearchParameters) => [...wallhavenQueryKeys.all(), params],
};

export function useWallhavenSearch() {
  const [q, setQuery] = useState<string | null>(null);

  const params = defaultSearchParamters();

  const result = useQuery({
    queryKey: wallhavenQueryKeys.query({ ...params, q }),
    queryFn: () => WallhavenAPIService.wallpaperSearch({ ...params, q }),
    placeholderData: keepPreviousData,
    enabled: true,
  });

  function search(value: string) {
    setQuery(value.trim());
  }

  return { ...result, search };
}
