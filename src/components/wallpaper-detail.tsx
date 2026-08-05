"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useMediaQuery } from "@/hooks/media-query";
import { Wallpaper } from "@/types/core/Wallpaper";
import { ImageZoom } from "./kibo-ui/image-zoom";
import { Button } from "./ui/button";
import { ArrowSquareOutIcon, DownloadIcon, HeartIcon } from "@phosphor-icons/react";
import { openUrl } from "@tauri-apps/plugin-opener";
import PurityBadge from "./purity-badge";

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

export function WallpaperCardDetail({
  wallpaper,
  onOpenChange,
}: WallpaperCardDetailProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const content = (
    <>
      <WallpaperPanel wallpaper={wallpaper} />
      <div className="typography overflow-y-scroll">
        <div>Views: {wallpaper?.views}</div>
        <div>Width: {wallpaper?.dimension_x}</div>
        <div>Height: {wallpaper?.dimension_y}</div>
        <div className="flex w-full">
          {wallpaper?.colors.map((color) => (
            <div
              style={{ backgroundColor: color }}
              className={`bg-${color} h-4 w-full`}
            ></div>
          ))}
        </div>
        {wallpaper?.purity && <PurityBadge purity={wallpaper?.purity} />}
        <div>File Size: {wallpaper?.file_size && formatFileSize(Number(wallpaper.file_size))}</div>
        <div>File Type: {wallpaper?.file_type}</div>
        <div>Favorites: {wallpaper?.favorites}</div>
        <div>Created At: {wallpaper?.created_at}</div>
        <Button>
          <DownloadIcon /> Save
        </Button>
        <Button>
          <HeartIcon /> Favorite
        </Button>
        <Button onClick={() => wallpaper?.url && openUrl(wallpaper.url)}>
          <ArrowSquareOutIcon /> Open
        </Button>
      </div>
    </>
  );

  if (isDesktop) {
    return (
      <Dialog open={!!wallpaper} onOpenChange={onOpenChange} modal>
        <DialogContent className="min-w-2xl">
          <DialogHeader>
            <DialogTitle></DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 h-full">{content}</div>
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
        <div className="overflow-y-scroll">{content}</div>
      </DrawerContent>
    </Drawer>
  );
}

function WallpaperPanel({ wallpaper }: { wallpaper: Wallpaper | null }) {
  return (
    <ImageZoom zoomMargin={100} className=" rounded-md">
      <img
        src={wallpaper?.path}
        className="h-fit w-fit aspect-square object-contain object-top rounded-md"
      />
    </ImageZoom>
  );
}
