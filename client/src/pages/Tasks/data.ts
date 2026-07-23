import { initialCompanies } from "../Companies/data";
import { financeCompanies } from "../Financials/data";
import type { Tone } from "../../components/ui/Pill";
import type { IconName } from "../../components/ui/Icon";

export { financeCompanies };

export type Priority = "high" | "medium" | "low";
export type TaskStatus = "not-started" | "in-progress" | "overdue" | "done";
/** Where the task came from — manual, an AI recommendation, or an integration alert. */
export type TaskSource = "manual" | "ai" | "integration";

export interface Task {
  id: string;
  title: string;
  /** Owning company, or null for a portfolio-wide task. */
  companyId: string | null;
  owner: string;
  due: string;
  priority: Priority;
  status: TaskStatus;
  source: TaskSource;
}

export const priorityMeta: Record<Priority, { tone: Tone; label: string }> = {
  high: { tone: "critical", label: "High" },
  medium: { tone: "warn", label: "Medium" },
  low: { tone: "neutral", label: "Low" },
};

export const taskStatusMeta: Record<TaskStatus, { tone: Tone; label: string }> = {
  "not-started": { tone: "neutral", label: "Not started" },
  "in-progress": { tone: "warn", label: "In progress" },
  overdue: { tone: "critical", label: "Overdue" },
  done: { tone: "good", label: "Done" },
};

export const sourceMeta: Record<TaskSource, { label: string; icon: IconName }> = {
  manual: { label: "Manual", icon: "list" },
  ai: { label: "From AI", icon: "sparkle" },
  integration: { label: "Integration", icon: "integrations" },
};

/** Company name + colour for a task, handling the portfolio-wide case. */
export function taskCompany(id: string | null): { name: string; color: string } {
  if (!id) return { name: "All", color: "#8A8F98" };
  const c = initialCompanies.find((x) => x.id === id);
  return { name: c?.name ?? id, color: c?.color ?? "#8A8F98" };
}

export const initialTasks: Task[] = [
  { id: "t1", title: "Reorder Cooldown Coat — Slate/M", companyId: "qynda", owner: "D. Osei", due: "Jul 22, 2026", priority: "high", status: "in-progress", source: "ai" },
  { id: "t2", title: "Reconnect TikTok Ads", companyId: "camel-glow", owner: "Integrations", due: "Jul 20, 2026", priority: "medium", status: "overdue", source: "integration" },
  { id: "t3", title: "Review “Glow-Reset” campaign creative", companyId: "amaq", owner: "N. Farrow", due: "Jul 24, 2026", priority: "medium", status: "not-started", source: "ai" },
  { id: "t4", title: "Confirm spend-cap plan with Finance", companyId: "amaq", owner: "Finance", due: "Jul 23, 2026", priority: "high", status: "not-started", source: "ai" },
  { id: "t5", title: "Finalize Q2 bonus batch", companyId: null, owner: "HR", due: "Jul 21, 2026", priority: "high", status: "in-progress", source: "manual" },
  { id: "t6", title: "Renew supplier agreement", companyId: "yoghi", owner: "T. Weber", due: "Aug 1, 2026", priority: "low", status: "not-started", source: "manual" },
  { id: "t7", title: "Upload June P&L statement", companyId: "qynda", owner: "Finance", due: "Jul 18, 2026", priority: "low", status: "done", source: "manual" },
];

export interface TaskFilter {
  id: TaskStatus | "all" | "open";
  label: string;
}

export const taskFilters: TaskFilter[] = [
  { id: "all", label: "All" },
  { id: "open", label: "Open" },
  { id: "in-progress", label: "In progress" },
  { id: "overdue", label: "Overdue" },
  { id: "done", label: "Done" },
];

export function matchesFilter(t: Task, filter: TaskFilter["id"]): boolean {
  if (filter === "all") return true;
  if (filter === "open") return t.status !== "done";
  return t.status === filter;
}
