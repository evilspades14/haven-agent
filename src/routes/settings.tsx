import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useStoreValue } from "@/hooks/use-settings";
import { ArrowUpRightIcon, CircleWavyCheckIcon } from "@phosphor-icons/react";
import { createFileRoute } from "@tanstack/react-router";
import { openUrl } from "@tauri-apps/plugin-opener";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/settings")({
  component: RouteComponent,
});

function RouteComponent() {
  const [apiKeyInput, setApiKeyInput] = useState<string>("");
  const [usernameInput, setUsernameInput] = useState<string>("");
  const [_apiKey, updateApiKey, _apiKeyReady] = useStoreValue<
    string | undefined
  >("apiKey", undefined);
  const [username, updateUsername, _usernameReady] = useStoreValue<
    string | undefined
  >("username", undefined);

  return (
    <div className="flex flex-col gap-3">
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
          <FieldGroup>
            <div className="grid grid-cols-2 gap-3">
              <Field>
                <FieldLabel>Username</FieldLabel>
                <FieldDescription>Wallhaven Username</FieldDescription>
                <Input
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  type="text"
                  placeholder={username}
                />
              </Field>
              <Field>
                <FieldLabel>API Key</FieldLabel>
                <FieldDescription>
                  Use a Wallhaven API key for more features.{" "}
                  <a
                    className="inline-flex items-center"
                    onClick={() =>
                      openUrl("https://wallhaven.cc/settings/account")
                    }
                  >
                    Get yours here <ArrowUpRightIcon />
                  </a>{" "}
                </FieldDescription>
                <Input
                  value={apiKeyInput}
                  onChange={(e) => setApiKeyInput(e.target.value)}
                  type="text"
                  placeholder="*****"
                />
              </Field>
            </div>
          </FieldGroup>
          <Button
            onClick={async () => {
              toast.promise(async () => updateUsername(usernameInput), {
                success: "Username updated.",
                error: "Failed to update username.",
              });
            }}
          >
            <CircleWavyCheckIcon /> Save
          </Button>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Theme</CardTitle>
          <CardDescription></CardDescription>
        </CardHeader>
        <CardContent></CardContent>
      </Card>
    </div>
  );
}
