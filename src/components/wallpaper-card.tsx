import { cn } from "@/lib/utils";
import { Wallpaper } from "@/types/core/Wallpaper";
import { motion } from "motion/react";

export type WallpaperCardProps = {
  wallpaper: Wallpaper;
  onClick?: () => void;
  className?: string;
};

export function WallpaperCard({
  wallpaper,
  onClick,
  className,
}: WallpaperCardProps) {
  return (
    <motion.div
      layout
      key={wallpaper.id}
      onClick={onClick}
      className={cn(
        "rounded-md outline overflow-hidden select-none break-inside-avoid cursor-pointer",
        className,
      )}
      style={{
        aspectRatio: `${wallpaper.dimension_x}/${wallpaper.dimension_y}`,
      }}
    >
      <img
        src={wallpaper.thumbs.original}
        alt={wallpaper.thumbs.small}
        loading="lazy"
        decoding="async"
        className="select-none w-full"
      />
    </motion.div>
  );
}
