import { Wallpaper } from "@/types/core/Wallpaper";

export function WallpaperCard({ wallpaper }: { wallpaper: Wallpaper }) {
  return (
    <div className="h-fit w-fit rounded-md outline overflow-hidden select-none">
      <img
        src={wallpaper.thumbs.original}
        key={wallpaper.id}
        decoding="async"
        loading="lazy"
        className="select-none"
      />
    </div>
  );
}
