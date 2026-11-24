"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useMediaQuery } from "@/hooks/media-query";
import { Wallpaper } from "@/types/core/Wallpaper";
import { Button } from "./ui/button";
import {
  ArrowSquareOutIcon,
  DownloadIcon,
  EyeIcon,
  FileArchiveIcon,
  FileIcon,
  HeartIcon,
  Icon,
  PercentIcon,
  XIcon,
} from "@phosphor-icons/react";
import { openUrl } from "@tauri-apps/plugin-opener";
import { cn } from "cn";
import { useDownload } from "@/hooks/use-download";
import { Progress } from "./ui/progress";
import WallpaperColorBar from "./wallpaper-color-bar";
import { ReactNode, RefObject, useRef } from "react";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemMedia,
  ItemTitle,
} from "./ui/item";

function formatFileSize(size: number): string {
  const sizeInKb = size / 1024;
  if (sizeInKb < 1024) {
    return `${sizeInKb.toFixed(2)} KB`;
  }
  const sizeInMb = sizeInKb / 1024;
  return `${sizeInMb.toFixed(2)} MB`;
}

export type WallpaperCardDetailProps = {
  wallpaper: Wallpaper | null;
  onOpenChange: (open: boolean) => void;
};

const wallpaperInfoFields: (wallpaper: Wallpaper) => {
  icon: Icon;
  label: string;
  value: ReactNode;
}[] = (wallpaper: Wallpaper) => [
  { icon: EyeIcon, label: "Views", value: wallpaper.views },
  { icon: HeartIcon, label: "Favorites", value: wallpaper.favorites },
  {
    icon: FileArchiveIcon,
    label: "File Size",
    value: formatFileSize(wallpaper.file_size),
  },
  { icon: FileIcon, label: "File Type", value: wallpaper.file_type },
  {
    icon: PercentIcon,
    label: "Resolution",
    value: (
      <div className="flex items-center justify-end gap-1">
        {wallpaper?.dimension_x}
        <XIcon />
        {wallpaper?.dimension_y}
      </div>
    ),
  },
];

function WallpaperInfoPanel({
  wallpaper,
}: {
  wallpaper: Wallpaper | null;
  className?: string;
}) {
  return (
    <div className="flex flex-col select-none gap-3">
      <div className="flex flex-wrap gap-1.5">
        {wallpaper &&
          wallpaperInfoFields(wallpaper).map((wp) => (
            <Item size={"xs"} variant={"muted"} className="flex-1 min-w-64">
              <ItemMedia variant={"icon"}>
                <wp.icon />
              </ItemMedia>

              <ItemContent>
                <ItemTitle>{wp.label}</ItemTitle>
              </ItemContent>
              <ItemActions className="font-mono">{wp.value}</ItemActions>
            </Item>
          ))}
      </div>

      {/*<Table>
        <TableRow>
          <TableCell className="flex items-center gap-2">
            <EyeIcon /> Views
          </TableCell>
          <TableCell className="text-right">{wallpaper?.views}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="flex items-center gap-2">
            <HeartIcon /> Favorites
          </TableCell>
          <TableCell className="text-right">{wallpaper?.favorites}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="flex items-center gap-2">
            <FileArchiveIcon /> File Size
          </TableCell>
          <TableCell className="text-right font-mono">
            {wallpaper?.file_size &&
              formatFileSize(Number(wallpaper.file_size))}
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="flex items-center gap-2">
            <FileIcon /> File Type
          </TableCell>
          <TableCell className="text-right font-mono">
            {wallpaper?.file_type}
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="flex items-center gap-2">
            <PercentIcon /> Resolution
          </TableCell>
          <TableCell className="justify-end font-mono">
            <div className="flex items-center justify-end gap-1">
              {wallpaper?.dimension_x}
              <XIcon />
              {wallpaper?.dimension_y}
            </div>
          </TableCell>
        </TableRow>
      </Table>*/}
      <WallpaperColorBar value={wallpaper?.colors} mode="view" />
    </div>
  );
}

export function WallpaperCardDetail({
  wallpaper,
  onOpenChange,
}: WallpaperCardDetailProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const { start, percent, status } = useDownload();
  const zoomedRef = useRef(false);
  const blockIfZoomed = (e: Event) => {
    if (zoomedRef.current) e.preventDefault();
  };

  if (isDesktop) {
    return (
      <Dialog open={!!wallpaper} onOpenChange={onOpenChange} modal>
        <DialogContent
          onEscapeKeyDown={blockIfZoomed}
          onInteractOutside={blockIfZoomed}
          className={cn(
            "gap-3 h-full max-h-[90vh] max-w-[95vw] min-w-[90vw] overflow-y-scroll",
          )}
        >
          <DialogHeader>
            <DialogTitle>{wallpaper?.source}</DialogTitle>
            <DialogDescription>{wallpaper?.short_url}</DialogDescription>
          </DialogHeader>

          <WallpaperPanel
            wallpaper={wallpaper}
            zoomedRef={zoomedRef}
            className="flex-1"
          />
          <WallpaperInfoPanel wallpaper={wallpaper} />
          <DialogFooter className="grid grid-cols-2">
            <Button
              disabled={!wallpaper}
              onClick={async () =>
                wallpaper && start(wallpaper?.path, wallpaper?.id)
              }
            >
              {status === "downloading" ? (
                <Progress value={percent} />
              ) : (
                <>
                  <DownloadIcon /> Save
                </>
              )}
            </Button>
            {/*<Button>
              <HeartIcon /> Favorite
            </Button>*/}
            <Button onClick={() => wallpaper?.url && openUrl(wallpaper.url)}>
              <ArrowSquareOutIcon /> Open
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={!!wallpaper} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle></DrawerTitle>
        </DrawerHeader>
        <div className="p-6 overflow-y-scroll">
          <WallpaperPanel wallpaper={wallpaper} zoomedRef={zoomedRef} />
          <WallpaperInfoPanel wallpaper={wallpaper} />
        </div>
        <DrawerFooter>
          <div className="flex gap-3 items-center w-full">
            <Button
              disabled={!wallpaper}
              onClick={async () =>
                wallpaper && start(wallpaper?.path, wallpaper?.id)
              }
              className="flex-1"
            >
              {status === "downloading" ? (
                <Progress value={percent} />
              ) : (
                <>
                  <DownloadIcon /> Save
                </>
              )}
            </Button>
            {/*<Button className="flex-1">
              <HeartIcon /> Favorite
            </Button>*/}
          </div>
          <Button onClick={() => wallpaper?.url && openUrl(wallpaper.url)}>
            <ArrowSquareOutIcon /> Open
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

function WallpaperPanel({
  wallpaper,
  className,
}: {
  wallpaper: Wallpaper | null;
  className?: string;
  zoomedRef?: RefObject<boolean>;
}) {
  // const handleZoomChange = useCallback((zoomed: boolean) => {
  //   if (zoomedRef === undefined) return;
  //   if (zoomed) {
  //     zoomedRef.current = true;
  //   } else {
  //     // Keep the flag up past the unzoom animation and focus restoration,
  //     // so the Escape/click/focus event that closed the zoom is still ignored
  //     setTimeout(() => {
  //       zoomedRef.current = false;
  //     }, 300);
  //   }
  // }, []);

  return (
    <div
      className={cn(
        "image-slot max-h-full max-w-full h-full w-full items-center justify-center overflow-hidden bg-background rounded-md",
        className,
      )}
    >
      {/*<ImageZoom onZoomChange={handleZoomChange}>*/}
      <img
        src={wallpaper?.path}
        className="h-full w-full object-contain"
        alt=""
        width={wallpaper?.dimension_x}
        height={wallpaper?.dimension_y}
      />
      {/*</ImageZoom>*/}
    </div>
  );
}
