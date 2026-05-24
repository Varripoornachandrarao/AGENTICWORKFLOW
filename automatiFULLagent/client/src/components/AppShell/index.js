import Link from "next/link";
import { useRouter } from "next/router";
import { Bell, LayoutDashboard, LogOut, Settings, Workflow, Zap } from "lucide-react";
import NotificationsDrawer from "@/components/NotificationsDrawer";
import { useSocket } from "@/hooks/useSocket";
import { useAuthStore } from "@/store/authStore";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/workflows/builder", label: "Builder", icon: Workflow },
  { href: "/executions", label: "Executions", icon: Zap },
  { href: "/integrations", label: "Integrations", icon: Bell },
  { href: "/settings", label: "Settings", icon: Settings }
];

export default function AppShell({ children, title = "Agentflow_AI" }) {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  useSocket();

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  return (
    <div className="min-h-screen bg-panel">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-line bg-white px-4 py-5 lg:block">
        <Link href="/dashboard" className="flex items-center gap-3 px-2 text-lg font-semibold">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-ink text-white">
            <Workflow size={19} />
          </span>
          Agentflow_AI
        </Link>

        <nav className="mt-8 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = router.pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium ${
                  active ? "bg-ink text-white" : "text-slate-600 hover:bg-slate-100 hover:text-ink"
                }`}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-line bg-white/90 px-5 backdrop-blur">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-accent">Operator Console</p>
            <h1 className="text-lg font-semibold text-ink">{title}</h1>
          </div>
          <div className="flex items-center gap-3">
            <NotificationsDrawer />
            <div className="hidden text-right sm:block">
              <p className="text-sm font-medium text-ink">{user?.name || "Operator"}</p>
              <p className="text-xs text-slate-500">{user?.role || "operator"}</p>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="grid h-10 w-10 place-items-center rounded-md border border-line bg-white text-slate-600 hover:text-ink"
              aria-label="Log out"
              title="Log out"
            >
              <LogOut size={18} />
            </button>
          </div>
        </header>

        <main className="px-5 py-6">{children}</main>
      </div>
    </div>
  );
}
