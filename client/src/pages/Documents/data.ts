import { initialCompanies } from "../Companies/data";
import { financeCompanies } from "../Financials/data";
import type { Tone } from "../../components/ui/Pill";

export { financeCompanies };

export type DocCategory = "contracts" | "financial" | "legal" | "hr";
/** Who may open the document — everyone with company access, or a restricted set. */
export type Access = "all" | "restricted";

export interface Doc {
  id: string;
  name: string;
  /** Owning company, or null for a portfolio-wide record. */
  companyId: string | null;
  category: DocCategory;
  owner: string;
  version: number;
  updated: string;
  /** Days until expiry; null = no expiry, negative = expired. */
  expiryDays: number | null;
  access: Access;
}

export const categories: { id: DocCategory; label: string }[] = [
  { id: "contracts", label: "Contracts & shareholder" },
  { id: "financial", label: "Financial reports" },
  { id: "legal", label: "Legal & investment" },
  { id: "hr", label: "HR, KPI & bonus" },
];

export const categoryLabel: Record<DocCategory, string> = {
  contracts: "Contracts",
  financial: "Financial",
  legal: "Legal",
  hr: "HR",
};

export function docCompany(id: string | null): { name: string; color: string } {
  if (!id) return { name: "All companies", color: "#8A8F98" };
  const c = initialCompanies.find((x) => x.id === id);
  return { name: c?.name ?? id, color: c?.color ?? "#8A8F98" };
}

/** Expiry pill copy + tone — drives the §15 document-expiry alerts. */
export function expiryMeta(days: number | null): { label: string; tone: Tone } {
  if (days == null) return { label: "—", tone: "neutral" };
  if (days <= 0) return { label: "Expired", tone: "critical" };
  if (days <= 30) return { label: `${days} days`, tone: "warn" };
  return { label: `${days} days`, tone: "neutral" };
}

export const initialDocs: Doc[] = [
  { id: "d1", name: "Shareholder Agreement — Amaq", companyId: "amaq", category: "contracts", owner: "Legal", version: 1, updated: "3 days ago", expiryDays: null, access: "restricted" },
  { id: "d2", name: "Shareholder Agreement — Qynda", companyId: "qynda", category: "contracts", owner: "Legal", version: 2, updated: "Jun 2026", expiryDays: null, access: "restricted" },
  { id: "d3", name: "Founder Vesting Schedule — Camel Glow", companyId: "camel-glow", category: "contracts", owner: "Legal", version: 1, updated: "May 2026", expiryDays: null, access: "restricted" },
  { id: "d4", name: "June 2026 P&L Statement", companyId: "qynda", category: "financial", owner: "Finance", version: 1, updated: "Today", expiryDays: null, access: "all" },
  { id: "d5", name: "Q2 2026 Consolidated Accounts", companyId: null, category: "financial", owner: "Finance", version: 1, updated: "2 days ago", expiryDays: null, access: "restricted" },
  { id: "d6", name: "May 2026 P&L Statement", companyId: "amaq", category: "financial", owner: "Finance", version: 1, updated: "Jun 2026", expiryDays: null, access: "all" },
  { id: "d7", name: "Annual Budget 2026", companyId: null, category: "financial", owner: "Finance", version: 3, updated: "Jan 2026", expiryDays: null, access: "restricted" },
  { id: "d8", name: "Supplier Agreement — Textile Co.", companyId: "yoghi", category: "legal", owner: "Legal", version: 2, updated: "5 days ago", expiryDays: 12, access: "all" },
  { id: "d9", name: "Camel Glow Due Diligence Pack", companyId: "camel-glow", category: "legal", owner: "Management", version: 4, updated: "1 week ago", expiryDays: null, access: "restricted" },
  { id: "d10", name: "Trademark Registration — Qynda", companyId: "qynda", category: "legal", owner: "Legal", version: 1, updated: "Apr 2026", expiryDays: 240, access: "all" },
  { id: "d11", name: "Insurance Policy — Amaq", companyId: "amaq", category: "legal", owner: "Operations", version: 1, updated: "Mar 2026", expiryDays: -3, access: "all" },
  { id: "d12", name: "Q2 Bonus Register", companyId: null, category: "hr", owner: "HR", version: 1, updated: "1 day ago", expiryDays: null, access: "restricted" },
  { id: "d13", name: "KPI Framework 2026", companyId: null, category: "hr", owner: "HR", version: 2, updated: "Feb 2026", expiryDays: null, access: "all" },
  { id: "d14", name: "Employee Handbook", companyId: null, category: "hr", owner: "HR", version: 5, updated: "Jan 2026", expiryDays: null, access: "all" },
];

export function categoryCount(docs: Doc[], id: DocCategory): number {
  return docs.filter((d) => d.category === id).length;
}
