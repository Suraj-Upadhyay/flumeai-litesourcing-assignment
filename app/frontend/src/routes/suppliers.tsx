import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/suppliers")({
  component: () => (
    <div className="w-full h-full relative">
      <Outlet />
    </div>
  ),
});
