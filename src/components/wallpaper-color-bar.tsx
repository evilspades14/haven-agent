import { cn } from "cn";
import { toast } from "sonner";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { useCallback, useEffect, useState } from "react";
import { HexColorPicker } from "react-colorful";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { ClipboardIcon, XIcon } from "@phosphor-icons/react";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

// Standard 3 or 6 digit hex
const standardHex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/i;

function WallpaperColorBar({
  value,
  onValueChange,
  mode = "view",
}:
  | {
      value?: string[];
      onValueChange?: (value: string[] | null) => void;
      onClick?: (color: string) => void;
      mode: "view";
    }
  | {
      value?: string[];
      onValueChange?: (value: string[] | null) => void;
      mode: "edit";
    }) {
  const copy = async (color: string) =>
    toast.promise(async () => await navigator.clipboard.writeText(color), {
      success: () => "Coped to clipboard.",
    });
  const [selectedColors, setSelectedColors] = useState<(string | null)[]>([
    null,
    null,
    null,
    null,
    null,
  ]);

  const handleSetColorSlot = useCallback(
    (color: string | null, idx: number) => {
      setSelectedColors((prev) => {
        let next = [...prev];
        next[idx] = color;
        return next;
      });
    },
    [setSelectedColors],
  );

  useEffect(() => {
    if (mode === "edit") {
      const next = selectedColors.filter((v) => Boolean(v)) as string[];
      onValueChange?.(next.length > 0 ? next : null);
    }
  }, [selectedColors]);

  return (
    <div className="flex w-full">
      {mode === "view" &&
        value?.map((color, idx) => (
          <button
            tabIndex={-1}
            style={{ backgroundColor: color }}
            className={cn(
              "h-5 w-full rounded-none ring-0",
              idx === 0 && "rounded-l-full",
              idx === value.length - 1 && "rounded-r-full",
            )}
            onClick={() => copy(color)}
          />
        ))}
      {mode === "edit" &&
        selectedColors?.map((color, idx) => (
          <Popover key={`colorbar-${idx}`}>
            <PopoverTrigger asChild>
              <button
                tabIndex={-1}
                style={{ backgroundColor: color ?? "transparent" }}
                className={cn(
                  "h-5 w-full rounded-none outline outline-accent",
                  idx === 0 && "rounded-l-full",
                  idx === selectedColors.length - 1 && "rounded-r-full",
                )}
              />
            </PopoverTrigger>
            <PopoverContent className="flex flex-col w-full">
              <HexColorPicker
                color={color ?? undefined}
                // onChange={(col) => handleSetColorSlot(col, idx)} TOO MUCH!
                onChangeEnd={(col) => handleSetColorSlot(col, idx)}
              />
              <div className="flex items-center gap-2">
                <Input value={color?.toUpperCase() ?? ""} disabled />
                <Button
                  size={"icon-sm"}
                  onClick={async () => {
                    const clipboardColor = await navigator.clipboard.readText();
                    if (standardHex.test(clipboardColor)) {
                      handleSetColorSlot(clipboardColor, idx);
                    }
                  }}
                >
                  <ClipboardIcon />
                </Button>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size={"icon-sm"}
                      onClick={() => handleSetColorSlot(null, idx)}
                    >
                      <XIcon />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Clear</TooltipContent>
                </Tooltip>
              </div>
            </PopoverContent>
          </Popover>
        ))}
    </div>
  );
}

export default WallpaperColorBar;
