import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { createFileRoute, Link, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex-1 gap-4">
      <Field orientation="horizontal">
        <Input placeholder="Search..." />
        <Button>Search</Button>
      </Field>
      
    </div>
  );
}
