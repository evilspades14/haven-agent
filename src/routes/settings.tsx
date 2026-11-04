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
  const [apiKey, updateApiKey, _apiKeyReady] = useStoreValue<
    string | undefined
  >("apiKey", undefined);
  const [username, updateUsername, usernameReady] = useStoreValue<
    string | undefined
  >("username", undefined);
  const [apiKeyInput, setApiKeyInput] = useState<string | undefined>(apiKey);
  const [usernameInput, setUsernameInput] = useState<string | undefined>(username);
  

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
                  defaultValue={usernameReady ? username : undefined}
                />
              </Field>
              <Field>
                <FieldLabel>API Key</FieldLabel>
                <FieldDescription>
                  Use a Wallhaven API key for more features.{" "}
                  <a
                    className="inline-flex items-center cursor-pointer"
                    onClick={() =>
                      openUrl("https://wallhaven.cc/settings/account")
                    }
                  >
                    Get your key here <ArrowUpRightIcon />
                  </a>{" "}
                </FieldDescription>
                <Input
                  value={apiKeyInput}
                  onChange={(e) => setApiKeyInput(e.target.value)}
                  type="password"
                  placeholder="*****"
                  defaultValue={apiKey}
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
