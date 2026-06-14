import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useWallhavenSearch } from "@/features/use-wallhaven";
import { createFileRoute } from "@tanstack/react-router";
import {
  CubeIcon,
  HandPeaceIcon,
  ImageIcon,
  MagnifyingGlassIcon,
  SlidersHorizontalIcon,
  UserIcon,
} from "@phosphor-icons/react";
import { WallpaperCard } from "@/components/wallpaper-card";
import { Fragment, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Toggle } from "@/components/ui/toggle";
import { ToggleGroup } from "@/components/ui/toggle-group";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { ScrollArea } from "@/components/ui/scroll-area";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data, isLoading, search } = useWallhavenSearch();
  const [input, setInput] = useState("");
  const [isOptionsDialogOpen, setIsOptionsDialogOpen] = useState(false);

  const allImages = data?.pages.flatMap((p) => p.data);

  return (
    <div className="flex flex-col gap-4 overflow-hidden">
      <Field orientation="horizontal">
        <Input
          placeholder="Search..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && search(input)}
        />

        <Button size={"icon"} onClick={() => setIsOptionsDialogOpen(true)}>
          <SlidersHorizontalIcon />
        </Button>
        <Button size={"icon"} onClick={() => search(input)}>
          <MagnifyingGlassIcon />
        </Button>
      </Field>
      {isLoading ? (
        Array.from({ length: 10 }).map((_, index) => (
          <Skeleton className="h-36 w-full mb-3" key={index} />
        ))
      ) : allImages && allImages.length > 0 ? (
        <div className="p-4 columns-1 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-3 justify-center h-full overflow-x-hidden">
          {allImages.map((wallpaper) => (
            <Fragment key={wallpaper.id}>
              <WallpaperCard wallpaper={wallpaper} />
            </Fragment>
          ))}
        </div>
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

      <Dialog open={isOptionsDialogOpen} onOpenChange={setIsOptionsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Search Options</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <ToggleGroup type="multiple" className="flex items-center gap-3">
            <Toggle value={"general"}>
              <CubeIcon />
            </Toggle>
            <Toggle value={"people"}>
              <UserIcon />
            </Toggle>
            <Toggle value={"anime"}>
              <HandPeaceIcon />
            </Toggle>
          </ToggleGroup>
        </DialogContent>
      </Dialog>
    </div>
  );
}
