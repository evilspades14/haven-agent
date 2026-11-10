import { cn } from "cn";
import { toast } from "sonner";

function WallpaperColorBar({
  colors,
  onClick,
}: {
  colors?: string[];
  onClick?: (color: string) => void;
}) {
  const copy = async (color: string) =>
    toast.promise(
      async () => {
        await navigator.clipboard.writeText(color);
      },
      {
        success: () => (
          <div className="flex items-center gap-3">
            Coped to clipboard.{" "}
            <div className="size-5 rounded" style={{ backgroundColor: color }} />
          </div>
        ),
      },
    );
  return (
    <div className="flex w-full">
      {colors?.map((color, idx) => (
        <button
          tabIndex={-1}
          style={{ backgroundColor: color }}
          className={cn(
            "h-5 w-full rounded-none ring-0",
            idx === 0 && "rounded-l-full",
            idx === colors.length - 1 && "rounded-r-full",
          )}
          onClick={() => copy(color)}
        />
      ))}
    </div>
  );
}

export default WallpaperColorBar;
