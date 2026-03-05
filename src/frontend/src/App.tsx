import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";
import Analytics from "@/pages/Analytics";
import CaseDetail from "@/pages/CaseDetail";
import CasesList from "@/pages/CasesList";
import Dashboard from "@/pages/Dashboard";
import NewAppraisal from "@/pages/NewAppraisal";
import SettingsPage from "@/pages/Settings";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
  useNavigate,
  useRouterState,
} from "@tanstack/react-router";
import {
  Activity,
  BarChart2,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  Plus,
  Settings,
  User,
} from "lucide-react";
import { useState } from "react";

// ── Router setup ──────────────────────────────────────────────────────────────

const rootRoute = createRootRoute({
  component: AppShell,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: Dashboard,
});

const casesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/cases",
  component: CasesList,
});

const caseDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/cases/$caseId",
  component: CaseDetail,
});

const newAppraisalRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/new-appraisal",
  component: NewAppraisal,
});

const analyticsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/analytics",
  component: Analytics,
});

const settingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/settings",
  component: SettingsPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  casesRoute,
  caseDetailRoute,
  newAppraisalRoute,
  analyticsRoute,
  settingsRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

// ── Nav config ────────────────────────────────────────────────────────────────

interface NavItem {
  label: string;
  to: string;
  icon: React.ComponentType<{ className?: string }>;
  ocid: string;
  exact?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  {
    label: "Dashboard",
    to: "/",
    icon: LayoutDashboard,
    ocid: "nav.dashboard.link",
    exact: true,
  },
  { label: "Cases", to: "/cases", icon: Briefcase, ocid: "nav.cases.link" },
  {
    label: "New Appraisal",
    to: "/new-appraisal",
    icon: Plus,
    ocid: "nav.new_appraisal.link",
  },
  {
    label: "Analytics",
    to: "/analytics",
    icon: BarChart2,
    ocid: "nav.analytics.link",
  },
];

const BOTTOM_ITEMS: NavItem[] = [
  {
    label: "Settings",
    to: "/settings",
    icon: Settings,
    ocid: "nav.settings.link",
  },
];

// ── Sidebar ───────────────────────────────────────────────────────────────────

function Sidebar({
  collapsed,
  onToggle,
}: { collapsed: boolean; onToggle: () => void }) {
  const navigate = useNavigate();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  function isActive(to: string, exact?: boolean) {
    if (exact) return currentPath === to;
    if (to === "/cases")
      return currentPath === "/cases" || currentPath.startsWith("/cases/");
    return currentPath.startsWith(to);
  }

  return (
    <aside
      className={cn(
        "relative flex flex-col bg-sidebar border-r border-sidebar-border transition-all duration-300 ease-in-out flex-shrink-0",
        collapsed ? "w-14" : "w-56",
      )}
    >
      {/* Logo */}
      <div
        className={cn(
          "flex items-center border-b border-sidebar-border flex-shrink-0",
          collapsed ? "h-14 justify-center px-0" : "h-14 gap-2.5 px-4",
        )}
      >
        <div className="w-7 h-7 rounded-md bg-primary/20 border border-primary/30 flex items-center justify-center flex-shrink-0">
          <Activity className="w-4 h-4 text-primary" />
        </div>
        {!collapsed && (
          <span className="font-display font-bold text-base text-foreground tracking-tight">
            Credit<span className="text-primary">IQ</span>
          </span>
        )}
      </div>

      {/* Main nav */}
      <nav className="flex-1 py-3 px-2 space-y-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.to, item.exact);
          return (
            <button
              type="button"
              key={item.to}
              data-ocid={item.ocid}
              onClick={() => navigate({ to: item.to })}
              className={cn(
                "w-full flex items-center rounded-md transition-all duration-150 group",
                collapsed ? "justify-center px-0 h-9" : "gap-3 px-3 h-9",
                active
                  ? "bg-primary/15 text-primary border border-primary/20"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground border border-transparent",
              )}
              title={collapsed ? item.label : undefined}
            >
              <Icon
                className={cn(
                  "w-4 h-4 flex-shrink-0 transition-colors",
                  active
                    ? "text-primary"
                    : "text-muted-foreground group-hover:text-foreground",
                )}
              />
              {!collapsed && (
                <span className="text-sm font-medium truncate">
                  {item.label}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom nav */}
      <div className="py-3 px-2 space-y-1 border-t border-sidebar-border">
        {BOTTOM_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.to);
          return (
            <button
              type="button"
              key={item.to}
              data-ocid={item.ocid}
              onClick={() => navigate({ to: item.to })}
              className={cn(
                "w-full flex items-center rounded-md transition-all duration-150 group",
                collapsed ? "justify-center px-0 h-9" : "gap-3 px-3 h-9",
                active
                  ? "bg-primary/15 text-primary border border-primary/20"
                  : "text-sidebar-foreground hover:bg-sidebar-accent border border-transparent",
              )}
              title={collapsed ? item.label : undefined}
            >
              <Icon className="w-4 h-4 flex-shrink-0 text-muted-foreground group-hover:text-foreground" />
              {!collapsed && (
                <span className="text-sm font-medium truncate">
                  {item.label}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Collapse toggle */}
      <button
        type="button"
        onClick={onToggle}
        className="absolute -right-3 top-[4.5rem] w-6 h-6 rounded-full border border-border bg-background flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-all z-10"
        title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {collapsed ? (
          <ChevronRight className="w-3 h-3" />
        ) : (
          <ChevronLeft className="w-3 h-3" />
        )}
      </button>
    </aside>
  );
}

// ── Header ────────────────────────────────────────────────────────────────────

function Header({
  sidebarCollapsed: _sidebarCollapsed,
}: { sidebarCollapsed: boolean }) {
  const routerState = useRouterState();
  const path = routerState.location.pathname;

  function getBreadcrumb(): string {
    if (path === "/") return "Dashboard";
    if (path === "/cases") return "Cases";
    if (path.startsWith("/cases/")) return "Cases / Case Detail";
    if (path === "/new-appraisal") return "New Appraisal";
    if (path === "/analytics") return "Analytics";
    if (path === "/settings") return "Settings";
    return "";
  }

  return (
    <header className="h-14 border-b border-border bg-background/80 backdrop-blur-sm flex items-center justify-between px-5 flex-shrink-0">
      <div className="flex items-center gap-3">
        {/* Mobile menu hint when sidebar is very narrow */}
        <span className="text-sm text-muted-foreground font-body">
          {getBreadcrumb()}
        </span>
      </div>

      {/* User info */}
      <div className="flex items-center gap-3">
        <div className="hidden sm:flex flex-col items-end">
          <span className="text-sm font-medium text-foreground leading-tight">
            Priya Sharma
          </span>
          <span className="text-xs text-muted-foreground leading-tight">
            Credit Manager
          </span>
        </div>
        <div className="w-8 h-8 rounded-md bg-primary/20 border border-primary/30 flex items-center justify-center flex-shrink-0">
          <User className="w-4 h-4 text-primary" />
        </div>
      </div>
    </header>
  );
}

// ── App Shell ─────────────────────────────────────────────────────────────────

function AppShell() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} />

      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Header sidebarCollapsed={collapsed} />
        <main className="flex-1 overflow-y-auto scrollbar-thin p-5 lg:p-6">
          <Outlet />
        </main>
        <footer className="px-6 py-2.5 border-t border-border/50 bg-background/80">
          <p className="text-xs text-muted-foreground text-center">
            © {new Date().getFullYear()}. Built with ❤ using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
              target="_blank"
              rel="noreferrer"
              className="text-primary hover:underline"
            >
              caffeine.ai
            </a>
          </p>
        </footer>
      </div>

      <Toaster />
    </div>
  );
}

// ── Root component ────────────────────────────────────────────────────────────

export default function App() {
  return <RouterProvider router={router} />;
}
