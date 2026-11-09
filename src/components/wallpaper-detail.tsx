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
  PercentIcon,
  XIcon,
} from "@phosphor-icons/react";
import { openUrl } from "@tauri-apps/plugin-opener";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { Table, TableCell, TableRow } from "./ui/table";
import { cn } from "cn";
import { useDownload } from "@/hooks/use-download";
import { Progress } from "./ui/progress";

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

function WallpaperInfoPanel({ wallpaper, className }: { wallpaper: Wallpaper | null, className?: string }) {
  return (
    <TooltipProvider disableHoverableContent>
      <div className="flex flex-col typography select-none">
        <Table>
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
          {wallpaper?.colors.map((color, idx) => (
            <div
              style={{ backgroundColor: color }}
              className={cn(
                `bg-${color} h-4 w-full`,
                idx === 0 && "rounded-l-full",
                idx === wallpaper?.colors.length - 1 && "rounded-r-full",
              )}
            ></div>
          ))}
        </div>
      </div>
    </TooltipProvider>
  );
}

export function WallpaperCardDetail({
  wallpaper,
  onOpenChange,
}: WallpaperCardDetailProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const { start, percent, status } = useDownload();

  if (isDesktop) {
    return (
      <Dialog open={!!wallpaper} onOpenChange={onOpenChange} modal>
        <DialogContent className="gap-3 h-full max-h-[90vh] max-w-[95vw] min-w-[90vw] overflow-y-scroll">
          <DialogHeader>
            <DialogTitle>{wallpaper?.source}</DialogTitle>
            <DialogDescription>{wallpaper?.short_url}</DialogDescription>
          </DialogHeader>
          <WallpaperPanel wallpaper={wallpaper} className="flex-1" />
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
          <WallpaperPanel wallpaper={wallpaper} />
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

function WallpaperPanel({ wallpaper, className }: { wallpaper: Wallpaper | null, className?: string }) {
  return (
    <div
      className={cn("max-h-full max-w-full h-full w-full items-center justify-center overflow-hidden bg-background rounded-md", className)}
    >
      <img
        src={wallpaper?.path}
        className="max-h-full max-w-full h-full w-full object-contain object-top"
        alt=""
        width={wallpaper?.dimension_x}
        height={wallpaper?.dimension_y}
      />
    </div>
  );
}
