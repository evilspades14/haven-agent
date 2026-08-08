import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useSettings } from "@/hooks/use-settings";
import { ArrowUpRightIcon } from "@phosphor-icons/react";
import { createFileRoute } from "@tanstack/react-router";
import { openUrl } from "@tauri-apps/plugin-opener";
import { load } from "@tauri-apps/plugin-store";
import { LazyStore } from "@tauri-apps/plugin-store";
import { useEffect, useState } from "react";
import { useSonner } from "sonner";
import { toast } from "sonner";

const store = new LazyStore("settings.json");

export const Route = createFileRoute("/settings")({
  component: RouteComponent,
});

function RouteComponent() {
  const [apiKeyInput, setApiKeyInput] = useState<string>("")
  const { apiKey, updateApiKey } = useSettings();
  return (
    <Card>
      <CardHeader>
        <CardTitle>API Credentials</CardTitle>
        <CardDescription>
          Use a Wallhaven API key for more features.{" "}
          <a
            className="inline-flex items-center"
            onClick={() => openUrl("https://wallhaven.cc/settings/account")}
          >
            Get yours here <ArrowUpRightIcon />
          </a>{" "}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Field orientation={"horizontal"}>
          <FieldLabel>Key</FieldLabel>
          <Input
            value={apiKeyInput}
            onChange={(e) => setApiKeyInput(e.target.value)}
            type="text"
            placeholder="*****"
          />
          <Button
            onClick={async () => {
              updateApiKey(apiKeyInput)
              toast.success("API Key updated.");
            }}
          >
            Save
          </Button>
        </Field>
      </CardContent>
    </Card>
  );
}
