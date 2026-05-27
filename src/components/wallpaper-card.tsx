import { cn } from "@/lib/utils";
import { Wallpaper } from "@/types/core/Wallpaper";
import { motion } from "motion/react"

export function WallpaperCard({ wallpaper }: { wallpaper: Wallpaper }) {
  return (
    <motion.div layout key={wallpaper.id} className={cn("rounded-md outline overflow-hidden select-none break-inside-avoid mb-3 cursor-pointer transition-all duration-150 hover:scale-105 hover:z-20")}>
      <img
        src={wallpaper.thumbs.original}
        decoding="async"
        loading="lazy"
        className="select-none w-full"
      />
    </motion.div>
  );
}
