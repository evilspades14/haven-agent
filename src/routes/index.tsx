import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useWallhavenSearch } from "@/features/use-wallhaven";
import { defaultSearchParamters } from "@/types/default/defaultSearchParameters";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data, isLoading } = useWallhavenSearch(defaultSearchParamters())
  console.log(data)
  return (
    <div className="flex flex-col gap-4">
      <Field orientation="horizontal">
        <Input placeholder="Search..." />
        <Button>Search</Button>
      </Field>
      <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-2">
        {
          isLoading ? Array.from({ length: 10 }).map((_, index) => (<Skeleton className="h-36 w-full" key={index} />)) : data?.data.map(wallpaper => <img src={wallpaper.path} key={wallpaper.id} className="h-36 w-full" />)
        }
      </div>
    </div>
  );
}