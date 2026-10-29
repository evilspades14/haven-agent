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
import { Field, FieldGroup, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { WallpaperCard } from "@/components/wallpaper-card";
import { WallpaperCardDetail } from "@/components/wallpaper-detail";
import WallpaperFeed from "@/components/wallpaper-feed";
import { useWallhavenSearch } from "@/features/use-wallhaven";
import useMasonryColumns from "@/hooks/masonry-columns";
import { useLoadMoreTrigger } from "@/hooks/use-load-more-trigger";
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

function RouteComponent() {
  const params = useWallhavenClientParamsStore((state) => state.params);
  const updateParams = useWallhavenClientParamsStore(
    (state) => state.updateParams,
  );

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


  return (
    <div className="flex flex-col gap-4 overflow-hidden h-dvh">
      <div className="flex items-center gap-1">
        <Field>
          <Input
            placeholder="Search..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && updateParams({ q: input })}
          />
        </Field>
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
          <SlidersHorizontalIcon />
        </Button>
        <Button size={"icon"} onClick={() => updateParams({ q: input })}>
          <MagnifyingGlassIcon />
        </Button>
      </div>
      <WallpaperFeed params={params} onSelectWallpaper={setSelectedWallpaper} />

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
