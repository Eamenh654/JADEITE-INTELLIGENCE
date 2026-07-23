import { financeCompanies } from "../Financials/data";
import type { Tone } from "../../components/ui/Pill";

export { financeCompanies };

export interface User {
  id: string;
  name: string;
  initials: string;
  color: string;
  role: string;
  scope: string;
  lastLogin: string;
  status: { tone: Tone; label: string };
}

export const initialUsers: User[] = [
  { id: "u1", name: "Syed Kareem", initials: "SK", color: "#B9812A", role: "Jadeite Management", scope: "All companies", lastLogin: "Today, 9:02 AM", status: { tone: "good", label: "Active" } },
  { id: "u2", name: "Dara Osei", initials: "DO", color: "#1B5B41", role: "Manager", scope: "Qynda · Merchandising", lastLogin: "Today, 8:14 AM", status: { tone: "good", label: "Active" } },
  { id: "u3", name: "Ravi Khanna", initials: "RK", color: "#A67C3D", role: "Finance", scope: "Amaq · Financials only", lastLogin: "Yesterday", status: { tone: "good", label: "Active" } },
  { id: "u4", name: "Nadia Farrow", initials: "NF", color: "#BE4430", role: "Manager", scope: "Amaq · Marketing", lastLogin: "2 days ago", status: { tone: "good", label: "Active" } },
  { id: "u5", name: "Marco Ruiz", initials: "MR", color: "#54655A", role: "Employee", scope: "Qynda · E-Commerce", lastLogin: "Invite sent", status: { tone: "info", label: "Invited" } },
  { id: "u6", name: "External Auditor", initials: "EX", color: "#8A8A8A", role: "External User", scope: "Qynda · Financials only", lastLogin: "14 days ago", status: { tone: "neutral", label: "Temporary — expires Aug 3" } },
];

/* ---- §16 per-user permission matrix ------------------------------ */

export const permModules = [
  "Company & dashboards",
  "Employees & HR",
  "Financials & equity",
  "E-Commerce & campaigns",
  "Documents & tasks",
  "AI",
] as const;

export const permRoles = [
  "Jadeite Management",
  "Founder / GM",
  "Finance",
  "HR",
  "Manager",
  "Employee",
  "External User",
] as const;

export type PermRole = (typeof permRoles)[number];

/** Default access per role × module (column order matches permModules). */
export const defaultMatrix: Record<PermRole, string[]> = {
  "Jadeite Management": ["All companies", "View, edit, approve", "View, export, approve", "View, approve", "Full access", "All permitted modules"],
  "Founder / GM": ["Own company only", "View, edit", "View, submit", "View, edit", "Full access", "Own company data"],
  Finance: ["Selected companies", "View salary", "View, submit, approve", "View spend", "Financial docs only", "Financial modules"],
  HR: ["Selected companies", "Full access", "No access", "No access", "HR docs only", "HR modules"],
  Manager: ["Own department", "View team, review", "No access", "View own dept.", "Own department", "Own department"],
  Employee: ["No access", "Own profile", "No access", "No access", "Own tasks", "Own KPIs & tasks"],
  "External User": ["Approved company only", "No access", "View only — masked", "No access", "Approved docs only", "No access"],
};

/** Selectable options for a module column — the distinct values seen, plus "No access". */
export function moduleOptions(moduleIdx: number): string[] {
  const set = new Set<string>();
  permRoles.forEach((r) => set.add(defaultMatrix[r][moduleIdx]));
  set.add("No access");
  return [...set];
}

/* ---- §16 system settings ----------------------------------------- */

export const systemGeneral: { label: string; value: string }[] = [
  { label: "Portfolio stages", value: "Startup/R&D, Active Management, Growth, Pipeline" },
  { label: "Approved departments", value: "Finance, HR, Marketing, E-Commerce, Operations, Product/R&D" },
  { label: "Default department set", value: "Overview, Finance, HR, Marketing, E-Commerce, Operations" },
];

export const systemKpiBonus: { label: string; value: string }[] = [
  { label: "KPI review cadence", value: "Quarterly" },
  { label: "Company / individual KPI split", value: "Set per role by HR + manager" },
  { label: "Bonus calculation basis", value: "Approved company or employee-group rules" },
  { label: "Appeal window", value: "One written appeal per quarterly review" },
];

export const systemStageFreq: { stage: string; frequency: string }[] = [
  { stage: "Startup / R&D", frequency: "When major spending or milestones occur" },
  { stage: "Active Management", frequency: "Monthly" },
  { stage: "Growth", frequency: "Monthly" },
  { stage: "Pipeline", frequency: "Historical + projections, as available" },
];

export const systemToggles: { id: string; label: string }[] = [
  { id: "priorities", label: "Task priorities: High / Medium / Low" },
  { id: "docExpiry", label: "Document expiry reminders" },
  { id: "escalate", label: "Auto-escalate overdue approvals" },
  { id: "ecomAlerts", label: "E-commerce integration alerts" },
];
