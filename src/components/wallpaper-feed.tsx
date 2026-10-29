import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { WallpaperCard } from "./wallpaper-card";
import { useRef } from "react";
import { useWallhavenSearch } from "@/features/use-wallhaven";
import { useLoadMoreTrigger } from "@/hooks/use-load-more-trigger";
import { SearchParameters } from "@/types/core/SearchParameters";
import { Spinner } from "./ui/spinner";
import { Wallpaper } from "@/types/core/Wallpaper";
import useMasonryColumns from "@/hooks/masonry-columns";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "./ui/empty";
import { ImageIcon } from "@phosphor-icons/react";
import { Skeleton } from "./ui/skeleton";

export type WallpaperFeedProps = {
  onSelectWallpaper?: (wallpaper: Wallpaper) => void;
  params: Partial<SearchParameters>;
};

function WallpaperFeed(props: WallpaperFeedProps) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useWallhavenSearch(props.params);
  const columns = useMasonryColumns(data?.wallpapers ?? [], 3);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useLoadMoreTrigger(
    fetchNextPage,
    !!hasNextPage && !isFetchingNextPage,
    scrollContainerRef,
  );
  if (!data) {
    return (
      <div>
        {" "}
        {Array.from({ length: 10 }).map((_, index) => (
          <Skeleton className="h-36 w-full mb-3" key={index} />
        ))}
      </div>
    );
  }

  if (!(data && data.pages.length > 0)) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant={"icon"}>
            <ImageIcon />
          </EmptyMedia>
          <EmptyTitle>No Wallpapers Found.</EmptyTitle>
          <EmptyDescription>
            Adjust the search parameters to find new wallpapers
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  return (
    <LayoutGroup>
      <div className="overflow-y-auto min-h-0 h-dvh" ref={scrollContainerRef}>
        <div className="flex flex-1 p-4 gap-3 justify-center">
          {columns.map((col, i) => (
            <div key={i} className="gap-4">
              <AnimatePresence mode="popLayout">
                {col.map((wallpaper) => (
                  <WallpaperCard
                    wallpaper={wallpaper}
                    onClick={() => props.onSelectWallpaper?.(wallpaper)}
                    key={wallpaper.id}
                    className="mb-3"
                  />
                ))}
              </AnimatePresence>
            </div>
          ))}
        </div>

        <div ref={sentinelRef} className="h-1" />

        <AnimatePresence>
          {isFetchingNextPage && (
            <motion.div
              key="spinner"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Spinner />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </LayoutGroup>
  );
}

export default WallpaperFeed;
