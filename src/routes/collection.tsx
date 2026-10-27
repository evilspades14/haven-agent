import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Item, ItemContent, ItemTitle } from "@/components/ui/item";
import { useUserCollections } from "@/features/use-wallhaven";
import { useSettings } from "@/hooks/use-settings";
import { ImageIcon } from "@phosphor-icons/react";
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
    <div className="flex flex-col">
      {data?.data && data.data?.length > 0 ? (
        data.data.map((collection) => (
          <Item>
            <ItemContent>
              <ItemTitle>{collection.label}</ItemTitle>
            </ItemContent>
          </Item>
        ))
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
