import { initialCompanies } from "../Companies/data";
import type { Tone } from "../../components/ui/Pill";

/** Decision categories routed to the central approvals page (§13). */
export type ApprovalType = "Financial" | "Bonus" | "KPI" | "Equity" | "Access" | "Document";

export type Outcome = "Approved" | "Changes requested" | "Deferred" | "Rejected";

export interface Approval {
  id: string;
  item: string;
  type: ApprovalType;
  /** Owning company, or null for a portfolio-wide decision. */
  companyId: string | null;
  requestedBy: string;
  submitted: string;
  /** The secondary (non-approve) action offered for this item. */
  secondary: Exclude<Outcome, "Approved">;
}

export const typeTone: Record<ApprovalType, "jade" | "gold"> = {
  Financial: "jade",
  Bonus: "gold",
  KPI: "jade",
  Equity: "gold",
  Access: "jade",
  Document: "jade",
};

export const outcomeTone: Record<Outcome, Tone> = {
  Approved: "good",
  "Changes requested": "warn",
  Deferred: "neutral",
  Rejected: "critical",
};

export function approvalCompany(id: string | null): { name: string; color: string } {
  if (!id) return { name: "Portfolio", color: "#8A8F98" };
  const c = initialCompanies.find((x) => x.id === id);
  return { name: c?.name ?? id, color: c?.color ?? "#8A8F98" };
}

export const initialApprovals: Approval[] = [
  { id: "ap1", item: "June financial submission", type: "Financial", companyId: "qynda", requestedBy: "Finance", submitted: "2 days ago", secondary: "Changes requested" },
  { id: "ap2", item: "Q2 bonus payment batch (4 employees)", type: "Bonus", companyId: null, requestedBy: "HR", submitted: "1 day ago", secondary: "Deferred" },
  { id: "ap3", item: "KPI appeal — N. Farrow, Customer Retention", type: "KPI", companyId: "amaq", requestedBy: "HR + Manager", submitted: "3 days ago", secondary: "Rejected" },
  { id: "ap4", item: "Camel Glow equity change — 35% proposed", type: "Equity", companyId: "camel-glow", requestedBy: "Management", submitted: "5 days ago", secondary: "Changes requested" },
  { id: "ap5", item: "New user access — Growth Analyst", type: "Access", companyId: "amaq", requestedBy: "Admin", submitted: "Today", secondary: "Rejected" },
  { id: "ap6", item: "Supplier Agreement — Textile Co. (v2)", type: "Document", companyId: "yoghi", requestedBy: "Legal", submitted: "Today", secondary: "Changes requested" },
];

export const approvalTypes: (ApprovalType | "All")[] = [
  "All",
  "Financial",
  "Bonus",
  "KPI",
  "Equity",
  "Access",
  "Document",
];
