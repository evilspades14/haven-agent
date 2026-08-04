import { Wallpaper } from "@/types/core/Wallpaper";
import { useMemo } from "react";

function useMasonryColumns(wallpapers: Wallpaper[], columnCount: number) {
  const columns = useMemo(() => {
    const heights = new Array(columnCount).fill(0);
    const cols: Wallpaper[][] = Array.from({ length: columnCount }, () => []);

    for (const wallpaper of wallpapers) {
      const shortest = heights.indexOf(Math.min(...heights));
      cols[shortest].push(wallpaper);
      // item.height should come from the API (see below) — this is an estimate
      heights[shortest] += wallpaper.dimension_y / wallpaper.dimension_x; // aspect ratio proxy
    }
    return cols;
  }, [wallpapers, columnCount]);

  return columns;
}

export default useMasonryColumns;