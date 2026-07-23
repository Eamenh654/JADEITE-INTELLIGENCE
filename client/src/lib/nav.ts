import type { IconName } from "../components/ui/Icon";

export interface NavItem {
  to: string;
  label: string;
  icon: IconName;
  /** Show a gold attention dot. */
  flag?: boolean;
  /** Exact-match highlighting (used for the index route). */
  end?: boolean;
}

export interface NavGroup {
  label?: string;
  items: NavItem[];
}

export const navGroups: NavGroup[] = [
  {
    items: [
      { to: "/", label: "Home", icon: "home", end: true },
      { to: "/companies", label: "Companies", icon: "companies" },
      { to: "/employees", label: "Employees", icon: "employees" },
      { to: "/kpis", label: "KPIs", icon: "kpis" },
      { to: "/bonuses", label: "Bonuses", icon: "bonuses" },
      { to: "/financials", label: "Financials", icon: "financials" },
    ],
  },
  {
    label: "Commerce & Data",
    items: [
      { to: "/ecommerce", label: "E-Commerce", icon: "ecommerce" },
      { to: "/integrations", label: "Integrations & AI", icon: "integrations" },
      { to: "/ai", label: "AI Assistant", icon: "ai" },
    ],
  },
  {
    label: "Execution",
    items: [
      { to: "/tasks", label: "Tasks", icon: "tasks", flag: true },
      { to: "/approvals", label: "Approvals", icon: "approvals", flag: true },
      { to: "/documents", label: "Documents", icon: "documents" },
      { to: "/reports", label: "Reports", icon: "reports" },
    ],
  },
  {
    label: "Administration",
    items: [
      { to: "/notifications", label: "Notifications", icon: "bell", flag: true },
      { to: "/users", label: "Users & Settings", icon: "users" },
      { to: "/audit-history", label: "Audit History", icon: "history" },
    ],
  },
];

/** Flat lookup for breadcrumb / page titles. */
export const navByPath: Record<string, NavItem> = Object.fromEntries(
  navGroups.flatMap((g) => g.items).map((i) => [i.to, i]),
);
