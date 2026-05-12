import React from "react";
import ReactDOM from "react-dom/client";

import { routeTree } from "./routeTree.gen";
import { createMemoryHistory, createRouter, RouterProvider } from "@tanstack/react-router";
import { ThemeProvider } from "./components/theme-provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient()

const router = createRouter({
  routeTree,
  context: { queryClient },
  history: createMemoryHistory({ initialEntries: ['/'] }),
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} context={{ queryClient }} />
      </QueryClientProvider>
    </ThemeProvider>
  </React.StrictMode>,
);
