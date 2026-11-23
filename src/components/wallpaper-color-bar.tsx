import { cn } from "cn";
import { toast } from "sonner";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import {
  ColorPicker,
  ColorPickerAlpha,
  ColorPickerEyeDropper,
  ColorPickerFormat,
  ColorPickerHue,
  ColorPickerOutput,
  ColorPickerSelection,
} from "./kibo-ui/color-picker";

function WallpaperColorBar({
  colors,
  mode = "view",
}: {
  colors?: string[];
  onClick?: (color: string) => void;
  mode: "view" | "edit";
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
            <div
              className="size-5 rounded"
              style={{ backgroundColor: color }}
            />
          </div>
        ),
      },
    );
  let colorsFormatted: (string | null)[] = new Array(5).fill(null);
  colors?.slice(0, 4).forEach((col, idx) => {
    colorsFormatted[idx] = col;
  });
  return (
    <div className="flex w-full">
      {mode === "view" &&
        colors?.map((color, idx) => (
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
      {mode === "edit" &&
        colorsFormatted?.map((color, idx) => (
          <Popover>
            <PopoverTrigger asChild>
              <button
                tabIndex={-1}
                style={{ backgroundColor: color ?? "transparent" }}
                className={cn(
                  "h-5 w-full rounded-none outline outline-accent",
                  idx === 0 && "rounded-l-full",
                  idx === colorsFormatted.length - 1 && "rounded-r-full",
                )}
              />
            </PopoverTrigger>
            <PopoverContent className="p-0 w-full">
              <ColorPicker className=" rounded-md border bg-background p-4 shadow-sm">
                <ColorPickerSelection />
                <ColorPickerHue />
                <div className="flex items-center gap-2">
                  {/*<ColorPickerOutput />*/}
                  <ColorPickerFormat />
                </div>
              </ColorPicker>
            </PopoverContent>
          </Popover>
        ))}
    </div>
  );
}

export default WallpaperColorBar;
