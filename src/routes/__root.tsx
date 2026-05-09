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
    <div className="flex-1 p-6 min-h-screen">
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuLink>
              <Link to="/">Home</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
      <main>
        <Outlet />
      </main>
    </div>
  );
}

export const Route = createRootRouteWithContext<AppContext>()({
  component: Root,
});
