import { cn } from "@/lib/utils";
import { Wallpaper } from "@/types/core/Wallpaper";

export function WallpaperCard({ wallpaper }: { wallpaper: Wallpaper }) {
  return (
    <div key={wallpaper.id} className={cn("rounded-md outline overflow-hidden select-none break-inside-avoid mb-3")}>
      <img
        src={wallpaper.thumbs.original}
        decoding="async"
        loading="lazy"
        className="select-none w-full"
      />
    </div>
  );
}
