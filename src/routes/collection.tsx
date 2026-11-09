import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Item, ItemContent, ItemMedia, ItemTitle } from "@/components/ui/item";
import { WallpaperCard } from "@/components/wallpaper-card";
import { useCollection, useUserCollections } from "@/features/use-wallhaven";
import { useStoreValue } from "@/hooks/use-settings";
import { ImageIcon, StackIcon } from "@phosphor-icons/react";
import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence } from "motion/react";
import { useState } from "react";

export const Route = createFileRoute("/collection")({
  component: RouteComponent,
});

function RouteComponent() {
  const [apiKey, _updateApiKey, _apiKeyReady] = useStoreValue<string | undefined>(
    "apiKey",
    undefined,
  );
  const [username, _updateUsername, _usernameReady] = useStoreValue<
    string | undefined
  >("username", undefined);
  const [selectedCollectionId, setSelectedCollectionId] = useState<
    number | null
  >();
  const { data } = useUserCollections({ apiKey });
  const { data: collection } = useCollection({
    apikey: apiKey!,
    collection_id: String(selectedCollectionId)!,
    username: username!,
  });
  if (!apiKey)
    return (
      <div className="h-dvh justify-center">
        <Empty>
          <EmptyHeader></EmptyHeader>
          <EmptyContent>No API Key found!</EmptyContent>
        </Empty>
      </div>
    );
  return (
    <div className="h-dvh">
      {data?.data && data.data?.length > 0 ? (
        <div className="flex h-full">
          <div className="flex flex-col gap-3">
            {data.data.map((collection) => (
              <Item
                variant={"outline"}
                className="select-none cursor-pointer"
                onClick={() => setSelectedCollectionId(collection.id)}
                key={collection.id}
              >
                <ItemMedia variant={"icon"}>
                  <StackIcon />
                </ItemMedia>
                <ItemContent>
                  <ItemTitle>{collection.label}</ItemTitle>
                </ItemContent>
              </Item>
            ))}
          </div>
          <div className="gap-4">
            <AnimatePresence mode="popLayout">
              {collection?.data.map((wallpaper) => (
                <WallpaperCard
                  wallpaper={wallpaper}
                  key={wallpaper.id}
                  className="mb-3"
                />
              ))}
            </AnimatePresence>
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
