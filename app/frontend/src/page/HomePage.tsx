import {
  SidebarNavigation,
  TopHeader,
  UserProfile,
} from "@/components/root/Sidebar";
import { Outlet, useLocation } from "@tanstack/react-router";

export const HomePage = () => {
  const location = useLocation();
  const isAuthPage = ["/login", "/signup"].includes(location.pathname);

  if (isAuthPage) {
    return <Outlet />;
  }

  return (
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
  );
};
