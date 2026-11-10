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
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { WallpaperCardDetail } from "@/components/wallpaper-detail";
import WallpaperFeed from "@/components/wallpaper-feed";
import { useMediaQuery } from "@/hooks/media-query";
import useWallhavenClientParamsStore from "@/hooks/wallhaven-params";
import { SearchParametersCategories } from "@/types/core/SearchParametersCategories";
import { SearchParametersSort } from "@/types/core/SearchParametersSort";
import { Wallpaper } from "@/types/core/Wallpaper";
import {
  CubeIcon,
  HandPeaceIcon,
  MagnifyingGlassIcon,
  SlidersHorizontalIcon,
  SmileyIcon,
  SmileyMeltingIcon,
  SmileyWinkIcon,
  SmileyXEyesIcon,
  SortAscendingIcon,
  UserIcon,
} from "@phosphor-icons/react";
import { CheckCircleIcon } from "@phosphor-icons/react/dist/ssr";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function categoryValuestoCategoryParam<T extends Record<string, boolean>>(
  values: Array<keyof T>,
): T {
  let categories = {} as T;
  values.forEach((val) => {
    categories[val] = true;
  });
  return categories;
}

function objParamToArray<T extends Record<string, boolean>>(
  obj: T,
): Array<keyof T & string> {
  return (Object.keys(obj) as Array<keyof T & string>).filter(
    (key) => obj[key],
  );
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

  const isDesktop = useMediaQuery("(min-width: 768px)");
  const feedColumns = isDesktop ? 3 : 2;

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
            <Button size={"icon"} variant={"outline"}>
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
                key={opt.value}
              >
                {opt.label}
                {params.sorting === opt.value && (
                  <CheckCircleIcon className="ml-auto" />
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <Button size={"icon"} variant={"outline"} onClick={() => setIsOptionsDialogOpen(true)}>
          <SlidersHorizontalIcon />
        </Button>
      </div>
      <WallpaperFeed
        params={params}
        onSelectWallpaper={setSelectedWallpaper}
        columns={feedColumns}
      />

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
          <FieldGroup>
            <Field>
              <FieldLabel>Category</FieldLabel>
              <ToggleGroup
                type="multiple"
                value={objParamToArray(params?.categories ?? {})}
                onValueChange={(
                  value: Array<keyof SearchParametersCategories>,
                ) =>
                  !!value &&
                  updateParams({
                    categories: categoryValuestoCategoryParam(value),
                  })
                }
              >
                <ToggleGroupItem value={"general"}>
                  <CubeIcon /> General
                </ToggleGroupItem>
                <ToggleGroupItem value={"people"}>
                  <UserIcon /> People
                </ToggleGroupItem>
                <ToggleGroupItem value={"anime"}>
                  <HandPeaceIcon /> Anime
                </ToggleGroupItem>
              </ToggleGroup>
            </Field>
            <Field>
              <FieldLabel>Purity</FieldLabel>
              <ToggleGroup
                type="multiple"
                value={objParamToArray(params?.purity ?? {})}
                onValueChange={(
                  value: Array<keyof SearchParametersCategories>,
                ) =>
                  !!value &&
                  updateParams({
                    // categories: categoryValuestoCategoryParam(value),
                    purity: categoryValuestoCategoryParam(value),
                  })
                }
              >
                <ToggleGroupItem value={"sfw"}>
                  <SmileyIcon /> SFW
                </ToggleGroupItem>
                <ToggleGroupItem value={"people"}>
                  <SmileyMeltingIcon /> SKETCHY
                </ToggleGroupItem>
                <ToggleGroupItem value={"anime"}>
                  <SmileyXEyesIcon /> NSFW
                </ToggleGroupItem>
              </ToggleGroup>
            </Field>
          </FieldGroup>
        </DialogContent>
      </Dialog>
    </div>
  );
}
