import { useAuth } from "@/context/AuthContext";
import { useLogout } from "@/domains/auth/auth.query";
import { Avatar, AvatarFallback } from "@packages/ui/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@packages/ui/components/ui/dropdown-menu";
import { Link, useNavigate } from "@tanstack/react-router";

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
  const { logout: clearAuthContext } = useAuth();
  const { mutate: logoutMutation } = useLogout();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutMutation(undefined, {
      onSettled: () => {
        // Regardless of server success/failure, clear local state and force redirect
        clearAuthContext();
        navigate({ to: "/login" });
      },
    });
  };

  return (
    <div className="mt-auto p-4 border-t border-slate-800">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="w-full flex items-center gap-3 p-2 rounded-md hover:bg-slate-800 transition-colors text-left">
            <Avatar className="h-8 w-8 rounded-full overflow-hidden shrink-0">
              <AvatarFallback className="bg-slate-700 text-xs rounded-full flex items-center justify-center text-white">
                PT
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col truncate">
              <span className="text-sm font-medium text-white truncate">
                Procurement Team
              </span>
              <span className="text-xs text-slate-400 truncate">
                team@litesourcing.com
              </span>
            </div>
          </button>
        </DropdownMenuTrigger>

        {/* We align to 'end' so it doesn't pop off the edge of the sidebar */}
        <DropdownMenuContent align="end" className="w-56 mb-2">
          <DropdownMenuItem className="cursor-pointer">
            Profile Settings
          </DropdownMenuItem>
          <DropdownMenuItem
            className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
            onClick={handleLogout}
          >
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
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
