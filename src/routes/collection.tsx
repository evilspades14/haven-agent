import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  Item,
  ItemContent,
  ItemHeader,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { useUserCollections } from "@/features/use-wallhaven";
import { useSettings } from "@/hooks/use-settings";
import { ImageIcon, StackIcon } from "@phosphor-icons/react";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/collection")({
  component: RouteComponent,
});

function RouteComponent() {
  const { apiKey } = useSettings();
  const { data } = useUserCollections({ apiKey });
  if (!apiKey)
    return (
      <div>
        <Empty>
          <EmptyHeader></EmptyHeader>
          <EmptyContent>No API Key found!</EmptyContent>
        </Empty>
      </div>
    );
  return (
    <div>
      {data?.data && data.data?.length > 0 ? (
        <div className="flex">
          <div className="gap-3">
            {data.data.map((collection) => (
              <Item variant={"outline"}>
                <ItemMedia variant={"icon"}>
                  <StackIcon />
                </ItemMedia>
                <ItemContent>
                  <ItemTitle>{collection.label}</ItemTitle>
                </ItemContent>
              </Item>
            ))}
          </div>
          <div>
            
          </div>
        </div>
      ) : (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant={"icon"}>
              <ImageIcon />
            </EmptyMedia>
            <EmptyTitle>No Collections Found.</EmptyTitle>
            <EmptyDescription></EmptyDescription>
          </EmptyHeader>
        </Empty>
      )}
    </div>
  );
}
