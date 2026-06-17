import { HomePage } from "@/page/HomePage";
import type { QueryClient } from "@tanstack/react-query";
import { createRootRouteWithContext, redirect } from "@tanstack/react-router";

interface MyRouterContext {
  queryClient: QueryClient;
  auth: {
    isAuthenticated: boolean;
  };
}

const publicRoutes = ["/login", "/signup"];

export const Route = createRootRouteWithContext<MyRouterContext>()({
  beforeLoad: ({ context, location }) => {
    if (
      !context.auth.isAuthenticated &&
      !publicRoutes.includes(location.pathname)
    ) {
      throw redirect({
        to: "/login",
        search: {
          redirect: location.href, // Store where they tried to go
        },
      });
    }

    // Redirect authenticated users away from the login page
    if (
      context.auth.isAuthenticated &&
      publicRoutes.includes(location.pathname)
    ) {
      throw redirect({ to: "/projects" });
    }
  },
  component: HomePage,
});
