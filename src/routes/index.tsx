import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useWallhavenSearch } from "@/features/use-wallhaven";
import { createFileRoute } from "@tanstack/react-router";
import { WallpaperCard } from "./WallpaperCard";
import { MagnifyingGlassIcon } from "@phosphor-icons/react";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data, isLoading } = useWallhavenSearch({});
  return (
    <div className="flex flex-col gap-4">
      <Field orientation="horizontal">
        <Input placeholder="Search..." />
        <Button><MagnifyingGlassIcon/></Button>
      </Field>
      <div className="flex flex-wrap gap-3 justify-center">
        {isLoading
          ? Array.from({ length: 10 }).map((_, index) => (
              <Skeleton className="h-36 w-full" key={index} />
            ))
          : data?.data.map((wallpaper) => (
              <WallpaperCard wallpaper={wallpaper} />
            ))}
      </div>
    </div>
  );
}


