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
import {
  FileSearchIcon,
  HouseSimpleIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  StackIcon,
} from "@phosphor-icons/react";
import { useMediaQuery } from "@/hooks/media-query";
import { Button } from "@/components/ui/button";

export interface AppContext {
  queryClient: QueryClient;
}

const TABS = [
  { id: "home", label: "Home", icon: HouseSimpleIcon, link: "/" },
  {
    id: "search",
    label: "Search",
    icon: MagnifyingGlassIcon,
    link: "",
    elevated: true,
  },
  {
    id: "collection",
    label: "Collection",
    icon: StackIcon,
    link: "/collection",
  },
  // { id: "activity", label: "Activity", icon: Bell },
  // { id: "profile", label: "Profile", icon: User },
];

function BottomNav() {
  return (
    // md:hidden -> only renders at mobile widths, matching a Tauri layout
    // where desktop keeps a sidebar/topnav and mobile gets this bar instead.
    <div
      className="md:hidden fixed inset-x-0 bottom-0 z-50 flex justify-center px-4"
      style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 16px)" }}
    >
      {/*<NavigationMenu>
        <NavigationMenuList className="bg-accent rounded-md">
          {TABS.map((tab) => {
            const Icon = tab.icon;

            if (tab.elevated) {
              return (
                <Button
                  key={tab.id}
                  onClick={() => onChange(tab.id)}
                  aria-label={tab.label}
                  variant={"destructive"}
                  className="relative -mt-7 flex h-14 w-14 items-center justify-center rounded-full transition-transform duration-200 ease-out active:scale-90"
                >
                  <Icon className="size" strokeWidth={2.5} />
                </Button>
              );
            }

            return (
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link
                    key={tab.id}
                    to={tab.link}
                    aria-label={tab.label}
                    className="bg-transparent relative flex w-14 flex-col items-center justify-center gap-0.5 rounded-full py-2 transition-transform duration-200 ease-out active:scale-90"
                  >
                    <span
                      className={
                        `absolute inset-0 bg-accent transition-opacity duration-200 ease-out rounded-full`
                        // ${
                        // isActive ? "opacity-100" : "opacity-0"
                        // }`
                      }
                    />
                    <Icon
                      className={`relative h-5 w-5 transition-all duration-200 ease-out`}
                    />
                    <span
                      className={`relative text-xs font-medium transition-colors duration-200`}
                    >
                      {tab.label}
                    </span>
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            );
          })}
        </NavigationMenuList>
      </NavigationMenu>*/}
      <nav className="flex items-center gap-1 rounded-full bg-background backdrop-blur-xl border shadow-xl px-2 py-2">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          // const isActive = active === tab.id;

          if (tab.elevated) {
            return (
              <button
                key={tab.id}
                // onClick={() => onChange(tab.id)}
                // aria-label={tab.label}
                // aria-current={isActive ? "page" : undefined}
                className="relative -mt-7 h-14 w-14 rounded-full transition-transform duration-200 ease-out active:scale-90 flex flex-col items-center justify-center bg-accent"
              >
                <Icon className="h-6 w-6" strokeWidth={2.5} />
              </button>
            );
          }

          return (
            <button
              key={tab.id}
              // onClick={() => onChange(tab.id)}
              aria-label={tab.label}
              // aria-current={isActive ? "page" : undefined}
              className="relative flex w-14 flex-col items-center justify-center gap-0.5 rounded-full py-2 transition-transform duration-200 ease-out active:scale-90"
            >
              <Icon
                className={`relative h-5 w-5 transition-all duration-200 ease-out`}
                
              />
            </button>
          );
        })}
      </nav>
    </div>
  );
}

function Root() {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  if (isDesktop) {
    return (
      <div className="flex-1 h-dvh p-6 overflow-hidden">
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link to="/">
                  <HouseSimpleIcon /> Home
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link to="/collection">
                  <StackIcon /> Collection
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        <main className="relative min-h-0 min-w-0 flex-1">
          <Outlet />
        </main>
      </div>
    );
  } else {
    return (
      <div className="flex-1 h-dvh p-6 overflow-hidden">
        <main className="relative min-h-0 min-w-0 flex-1">
          <Outlet />
        </main>
        <BottomNav />
      </div>
    );
  }
}

export const Route = createRootRouteWithContext<AppContext>()({
  component: Root,
});
