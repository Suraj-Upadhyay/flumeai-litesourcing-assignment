import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import { Avatar, AvatarFallback } from "@packages/ui/components/ui/avatar";

function SidebarNavigation() {
  return (
    <nav className="flex flex-col gap-2 grow">
      <Link
        to="/projects"
        className="p-2 rounded hover:bg-slate-800 text-slate-300 [&.active]:bg-blue-600 [&.active]:text-white [&.active]:font-semibold transition-colors"
      >
        📁 Projects
      </Link>
      <Link
        to="/suppliers"
        className="p-2 rounded hover:bg-slate-800 text-slate-300 [&.active]:bg-blue-600 [&.active]:text-white [&.active]:font-semibold transition-colors"
      >
        🚚 Suppliers
      </Link>
    </nav>
  );
}

function UserProfile() {
  return (
    <div className="mt-auto flex items-center gap-3 p-4 border-t border-slate-800">
      <Avatar className="h-8 w-8">
        <AvatarFallback className="bg-slate-700 text-xs">PT</AvatarFallback>
      </Avatar>
      <span className="text-sm font-medium">Procurement Team</span>
    </div>
  );
}

function TopHeader() {
  return (
    <header className="h-14 border-b bg-white flex items-center px-6 shadow-sm">
      <h1 className="text-lg font-medium text-gray-700">Workspace</h1>
    </header>
  );
}

export const Route = createRootRoute({
  component: () => (
    <div className="flex h-screen w-full bg-slate-50">
      <aside className="w-64 bg-slate-950 text-white flex flex-col">
        <div className="text-xl font-bold p-6 tracking-wide">
          🏢 LiteSourcing
        </div>
        <div className="px-4 flex-1 flex flex-col">
          <SidebarNavigation />
        </div>
        <UserProfile />
      </aside>

      <main className="flex-1 overflow-auto flex flex-col">
        <TopHeader />
        <div className="p-6 flex-1 max-w-7xl mx-auto w-full">
          <Outlet />
        </div>
      </main>
    </div>
  ),
});
