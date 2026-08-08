import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { WallpaperCard } from "@/components/wallpaper-card";
import { WallpaperCardDetail } from "@/components/wallpaper-detail";
import { useWallhavenSearch } from "@/features/use-wallhaven";
import useMasonryColumns from "@/hooks/masonry-columns";
import useWallhavenClientParamsStore from "@/hooks/wallhaven-params";
import { SearchParametersCategories } from "@/types/core/SearchParametersCategories";
import { SearchParametersSort } from "@/types/core/SearchParametersSort";
import { Wallpaper } from "@/types/core/Wallpaper";
import {
  CubeIcon,
  HandPeaceIcon,
  ImageIcon,
  MagnifyingGlassIcon,
  SlidersHorizontalIcon,
  SortAscendingIcon,
  UserIcon,
} from "@phosphor-icons/react";
import { CheckCircleIcon } from "@phosphor-icons/react/dist/ssr";
import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, LayoutGroup, motion, useInView } from "motion/react";
import React from "react";
import { useEffect, useRef, useState } from "react";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function categoryValuestoCategoryParam(
  values: Array<keyof SearchParametersCategories>,
): SearchParametersCategories {
  let categories = {} as SearchParametersCategories;
  values.forEach((val) => {
    categories[val] = true;
  });
  return categories;
}

function useLoadMoreTrigger(
  onIntersect: () => void,
  enabled: boolean,
  root?: React.RefObject<Element>,
) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { root, margin: "0px 0px 500px 0px" });

  useEffect(() => {
    if (isInView && enabled) onIntersect();
  }, [isInView, enabled, onIntersect]);

  console.log(isInView);
  return ref;
}

function RouteComponent() {
  const params = useWallhavenClientParamsStore((state) => state.params);
  const updateParams = useWallhavenClientParamsStore(
    (state) => state.updateParams,
  );
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useWallhavenSearch(params);

  const [selectedWallpaper, setSelectedWallpaper] = useState<Wallpaper | null>(
    null,
  );
  const [input, setInput] = useState(params.q ?? "");
  const [isOptionsDialogOpen, setIsOptionsDialogOpen] = useState(false);

  const sortOptions = [
    { value: "date_added", label: "Date Added", disabled: false },
    { value: "relevance", label: "Relevance", disabled: !params.q },
    { value: "random", label: "Random", disabled: false },
    { value: "views", label: "Views", disabled: false },
    { value: "favorites", label: "Favorites", disabled: false },
    { value: "toplist", label: "Toplist", disabled: false },
  ];

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useLoadMoreTrigger(
    fetchNextPage,
    !!hasNextPage && !isFetchingNextPage,
    scrollContainerRef,
  );

  const columns = useMasonryColumns(data?.wallpapers ?? [], 3);

  return (
    <div className="flex flex-col gap-4 overflow-hidden h-dvh">
      <Field orientation="horizontal">
        <Input
          placeholder="Search..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && updateParams({ q: input })}
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size={"icon"}>
              <SortAscendingIcon />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {sortOptions.map((opt) => (
              <DropdownMenuItem
                onClick={() =>
                  updateParams({ sorting: opt.value as SearchParametersSort })
                }
                disabled={opt.disabled}
              >
                {opt.label}
                {params.sorting === opt.value && (
                  <CheckCircleIcon className="ml-auto" />
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <Button size={"icon"} onClick={() => setIsOptionsDialogOpen(true)}>
          {!!params.sorting ? (
            <SlidersHorizontalIcon />
          ) : (
            <SlidersHorizontalIcon />
          )}
        </Button>
        <Button size={"icon"} onClick={() => updateParams({ q: input })}>
          <MagnifyingGlassIcon />
        </Button>
      </Field>
      {!data ? (
        Array.from({ length: 10 }).map((_, index) => (
          <Skeleton className="h-36 w-full mb-3" key={index} />
        ))
      ) : data && data.pages.length > 0 ? (
        <LayoutGroup>
          <div
            className="overflow-y-auto min-h-0 h-dvh"
            ref={scrollContainerRef}
          >
            <div className="flex flex-1 p-4 gap-3 justify-center">
              {columns.map((col, i) => (
                <div key={i} className="gap-4">
                  <AnimatePresence mode="popLayout">
                    {col.map((wallpaper) => (
                      <WallpaperCard
                        wallpaper={wallpaper}
                        onClick={() => setSelectedWallpaper(wallpaper)}
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
      ) : (
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
      )}

      <WallpaperCardDetail
        wallpaper={selectedWallpaper}
        onOpenChange={(open) => !open && setSelectedWallpaper(null)}
      />

      <Dialog open={isOptionsDialogOpen} onOpenChange={setIsOptionsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Search Options</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <ToggleGroup
            type="multiple"
            value={Object.keys(params.categories ?? {}).filter((cat) => cat)}
            onValueChange={(value: Array<keyof SearchParametersCategories>) =>
              updateParams({
                categories: categoryValuestoCategoryParam(value),
              })
            }
          >
            <ToggleGroupItem value={"general"} aria-label="General">
              <CubeIcon />
            </ToggleGroupItem>
            <ToggleGroupItem value={"people"} aria-label="People">
              <UserIcon />
            </ToggleGroupItem>
            <ToggleGroupItem value={"anime"} aria-label="Anime">
              <HandPeaceIcon />
            </ToggleGroupItem>
          </ToggleGroup>
        </DialogContent>
      </Dialog>
    </div>
  );
}
