import WallhavenAPIService from "@/services/WallhavenAPIService";
import { SearchParameters } from "@/types/core/SearchParameters";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export const wallhavenQueryKeys = {
  all: () => ["search"],
  query: (params: SearchParameters) => [...wallhavenQueryKeys.all(), params],
};

function useWallhavenSearch(params: SearchParameters) {
  return useQuery({
    queryKey: wallhavenQueryKeys.query(params),
    queryFn: () => WallhavenAPIService.search(params),
    placeholderData: keepPreviousData,
  });
}
