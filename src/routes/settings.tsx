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

  const updateSettings = async () =>
    toast
      .promise(
        async () => {
          await updateUsername(usernameInput);
          await updateApiKey(apiKeyInput);
        },
        {
          success: "Username updated.",
          error: "Failed to update username.",
        },
      )
      .unwrap();

  return (
    <div className="flex flex-col gap-3 justify-center h-dvh">
      <Card className="settings-card">
        <CardHeader>
          <CardTitle>Wallhaven Credentials</CardTitle>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <div className="grid gap-3">
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
          
        </CardContent>
        <CardFooter>
          <Button onClick={updateSettings}>
            <CircleWavyCheckIcon /> Save
          </Button>
        </CardFooter>
      </Card>
      <Card className="settings-card">
        <CardHeader>
          <CardTitle>Theme</CardTitle>
          <CardDescription></CardDescription>
        </CardHeader>
        <CardContent></CardContent>
      </Card>
    </div>
  );
}
