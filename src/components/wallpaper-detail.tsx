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
import {
  ArrowSquareOutIcon,
  DownloadIcon,
  EyeIcon,
  FileArchiveIcon,
  FileIcon,
  FileImageIcon,
  HeartIcon,
  PercentIcon,
  XIcon,
} from "@phosphor-icons/react";
import { openUrl } from "@tauri-apps/plugin-opener";
import PurityBadge from "./purity-badge";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { Table, TableCaption, TableCell, TableRow } from "./ui/table";

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

  const wallpaperPanel = <WallpaperPanel wallpaper={wallpaper} />;
  const infoPanel = (
    <TooltipProvider disableHoverableContent>
      <div className="flex flex-col typography overflow-y-scroll">
        <Table className="overflow-y-scroll">
          <Tooltip>
            <TooltipTrigger asChild>
              <TableRow>
                <TableCell>
                  <EyeIcon />
                </TableCell>
                <TableCell className="text-right">{wallpaper?.views}</TableCell>
              </TableRow>
            </TooltipTrigger>
            <TooltipContent>Views</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <TableRow>
                <TableCell>
                  <HeartIcon />
                </TableCell>
                <TableCell className="text-right">
                  {wallpaper?.favorites}
                </TableCell>
              </TableRow>
            </TooltipTrigger>
            <TooltipContent>Favorites</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <TableRow>
                <TableCell>
                  <FileArchiveIcon />
                </TableCell>
                <TableCell className="text-right font-mono">
                  {wallpaper?.file_size &&
                    formatFileSize(Number(wallpaper.file_size))}
                </TableCell>
              </TableRow>
            </TooltipTrigger>
            <TooltipContent>File Size</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <TableRow>
                <TableCell>
                  <FileIcon />
                </TableCell>
                <TableCell className="text-right font-mono">
                  {wallpaper?.file_type}
                </TableCell>
              </TableRow>
            </TooltipTrigger>
            <TooltipContent>File Type</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <TableRow>
                <TableCell>
                  <PercentIcon />
                </TableCell>
                <TableCell className="flex items-center justify-end">
                  {wallpaper?.dimension_x}
                  <XIcon />
                  {wallpaper?.dimension_y}
                </TableCell>
              </TableRow>
            </TooltipTrigger>
            <TooltipContent>Resolution</TooltipContent>
          </Tooltip>
        </Table>
        <div className="flex w-full">
          {wallpaper?.colors.map((color) => (
            <div
              style={{ backgroundColor: color }}
              className={`bg-${color} h-4 w-full rounded-full`}
            ></div>
          ))}
        </div>
        {wallpaper?.purity && <PurityBadge purity={wallpaper?.purity} />}
        <div>Created At: {wallpaper?.created_at}</div>
        {/*<Button>
          <DownloadIcon /> Save
        </Button>
        <Button>
          <HeartIcon /> Favorite
        </Button>
        <Button onClick={() => wallpaper?.url && openUrl(wallpaper.url)}>
          <ArrowSquareOutIcon /> Open
        </Button>*/}
      </div>
    </TooltipProvider>
  );

  if (isDesktop) {
    return (
      <Dialog open={!!wallpaper} onOpenChange={onOpenChange} modal>
        <DialogContent className="flex items-center min-w-[85vw] max-h-dvh gap-3 pl-0 ml-0">
          <DialogHeader>
            <DialogTitle></DialogTitle>{" "}
          </DialogHeader>
          {infoPanel}
          <div className="flex flex-col w-fit gap-3">
            {wallpaperPanel}
            <div className="grid grid-cols-3">
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
          </div>
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
          {wallpaperPanel}
          {infoPanel}
        </div>
      </DrawerContent>
    </Drawer>
  );
}

function WallpaperPanel({ wallpaper }: { wallpaper: Wallpaper | null }) {
  return (
    <div className="flex h-fit w-full items-center justify-center overflow-hidden">
      <img
        src={wallpaper?.path}
        className="max-h-full max-w-full object-contain object-top rounded-md"
        alt=""
        width={wallpaper?.dimension_x}
        height={wallpaper?.dimension_y}
        // decoding="async"
        // loading="eager"
      />
    </div>
  );
}
