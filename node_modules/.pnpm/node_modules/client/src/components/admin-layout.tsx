import { Link, useLocation } from "wouter";
import {
  LayoutDashboard,
  ClipboardList,
  UtensilsCrossed,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { useAdminAuth } from "../lib/admin-auth-context";

const sidebarLinks = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/orders", label: "Orders", icon: ClipboardList },
  { href: "/admin/menu", label: "Menu Items", icon: UtensilsCrossed },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { logout } = useAdminAuth();
  const [location, setLocation] = useLocation();

  const handleLogout = async () => {
    await logout();
    setLocation("/admin/login");
  };

  return (
    <div className="min-h-screen flex bg-clay-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-clay-200 flex flex-col shadow-sm hidden md:flex">
        {/* Logo */}
        <div className="p-6 border-b border-clay-200">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 gradient-warm rounded-lg flex items-center justify-center shadow-md">
              <UtensilsCrossed className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-heading font-bold text-lg text-clay-900">
                Bhukad Hut
              </span>
              <p className="text-xs text-clay-500 font-body">Admin Panel</p>
            </div>
          </Link>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 p-4 space-y-1">
          {sidebarLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold transition-all duration-200 ${
                  isActive
                    ? "bg-saffron-50 text-saffron-600 border border-saffron-200"
                    : "text-clay-600 hover:bg-clay-50 hover:text-clay-900"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="flex-1">{link.label}</span>
                {isActive && <ChevronRight className="w-4 h-4" />}
              </Link>
            );
          })}
        </nav>

        {/* Sign Out */}
        <div className="p-4 border-t border-clay-200">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold text-red-600 hover:bg-red-50 transition-colors w-full"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile Header for Admin */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-clay-200 shadow-sm">
        <div className="flex items-center justify-between px-4 h-14">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 gradient-warm rounded-md flex items-center justify-center">
              <UtensilsCrossed className="w-4 h-4 text-white" />
            </div>
            <span className="font-heading font-bold text-clay-900">Admin</span>
          </Link>
          <div className="flex items-center gap-1">
            {sidebarLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`p-2 rounded-lg ${
                    isActive
                      ? "bg-saffron-50 text-saffron-600"
                      : "text-clay-500"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </Link>
              );
            })}
            <button
              onClick={handleLogout}
              className="p-2 rounded-lg text-red-500"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 md:overflow-y-auto">
        <div className="md:hidden h-14" /> {/* spacer for mobile header */}
        <div className="p-4 md:p-8 max-w-6xl mx-auto">{children}</div>
      </div>
    </div>
  );
}
