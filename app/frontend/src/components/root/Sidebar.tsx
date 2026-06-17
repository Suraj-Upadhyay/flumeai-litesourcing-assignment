import { Avatar, AvatarFallback } from "@packages/ui/components/ui/avatar";
import { Link } from "@tanstack/react-router";

export function SidebarNavigation() {
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

export function UserProfile() {
  return (
    <div className="mt-auto flex items-center gap-3 p-4 border-t border-slate-800">
      <Avatar className="h-8 w-8 rounded-full">
        <AvatarFallback className="bg-slate-700 h-full w-full text-xs rounded-full">
          PT
        </AvatarFallback>
      </Avatar>
      <span className="text-sm font-medium">Procurement Team</span>
    </div>
  );
}

export function TopHeader() {
  return (
    <header className="h-14 border-b bg-white flex items-center px-6 shadow-sm">
      <h1 className="text-lg font-medium text-gray-700">Workspace</h1>
    </header>
  );
}
