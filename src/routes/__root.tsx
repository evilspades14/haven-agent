import {
  createRootRouteWithContext,
  Link,
  Outlet,
} from "@tanstack/react-router";
import { QueryClient } from "@tanstack/react-query";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";

export interface AppContext {
  queryClient: QueryClient;
}

function Root() {
  return (
    <div className="flex-1 h-dvh p-6 overflow-hidden">
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <Link to="/">Home</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <Link to="/collection">Collection</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
      <main className="relative min-h-0 min-w-0 flex-1">
        <Outlet />
      </main>
    </div>
  );
}

export const Route = createRootRouteWithContext<AppContext>()({
  component: Root,
});
