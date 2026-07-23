import type { Tone } from "../../components/ui/Pill";
import type { IconName } from "../../components/ui/Icon";

/** In-platform notification categories (§15). */
export type NotifCategory = "kpi" | "bonus" | "financial" | "task" | "document" | "ecommerce";

export interface Notif {
  id: string;
  category: NotifCategory;
  title: string;
  detail: string;
  time: string;
  read: boolean;
}

export const categoryMeta: Record<NotifCategory, { label: string; icon: IconName; tone: Tone }> = {
  kpi: { label: "KPI", icon: "kpis", tone: "info" },
  bonus: { label: "Bonus", icon: "bonuses", tone: "warn" },
  financial: { label: "Financial", icon: "financials", tone: "info" },
  task: { label: "Task", icon: "tasks", tone: "warn" },
  document: { label: "Document", icon: "documents", tone: "neutral" },
  ecommerce: { label: "E-Commerce", icon: "integrations", tone: "critical" },
};

export const initialNotifs: Notif[] = [
  { id: "n1", category: "ecommerce", title: "TikTok Ads integration stopped syncing", detail: "Camel Glow — token expired, spend running blind for 26 hours.", time: "20 min ago", read: false },
  { id: "n2", category: "kpi", title: "KPI appeal awaiting review", detail: "N. Farrow — Customer Retention (Amaq) submitted an appeal.", time: "1 hour ago", read: false },
  { id: "n3", category: "bonus", title: "Q2 bonus batch awaiting management approval", detail: "4 employees across the portfolio — HR requested sign-off.", time: "3 hours ago", read: false },
  { id: "n4", category: "task", title: "Task overdue", detail: "Reconnect TikTok Ads (Camel Glow) passed its Jul 20 due date.", time: "Today, 9:10 AM", read: false },
  { id: "n5", category: "financial", title: "Financial report awaiting approval", detail: "Qynda June financial submission is ready for your review.", time: "Yesterday", read: true },
  { id: "n6", category: "document", title: "Document expiring soon", detail: "Supplier Agreement — Textile Co. (Yoghi) expires in 12 days.", time: "Yesterday", read: true },
  { id: "n7", category: "ecommerce", title: "Marketing spend above cap", detail: "Amaq spend is 21.4% of revenue vs the 20% approved cap.", time: "2 days ago", read: true },
  { id: "n8", category: "kpi", title: "Quarterly KPI reviews opened", detail: "Q2 evaluation window is now open for all active companies.", time: "3 days ago", read: true },
];

export const notifFilters: { id: NotifCategory | "all" | "unread"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "unread", label: "Unread" },
  { id: "kpi", label: "KPI" },
  { id: "bonus", label: "Bonus" },
  { id: "financial", label: "Financial" },
  { id: "task", label: "Task" },
  { id: "document", label: "Document" },
  { id: "ecommerce", label: "E-Commerce" },
];
