import { financeCompanies } from "../Financials/data";

export { financeCompanies };

export type Format = "PDF" | "Excel";

/** Report families the Admin can generate (§15). */
export const reportTypes = [
  "Portfolio summary",
  "Company financial",
  "Consolidated financials",
  "Employee KPI",
  "Bonus register",
  "Task & action log",
  "Risk & audit",
  "Document register",
  "E-Commerce performance",
] as const;

export type ReportType = (typeof reportTypes)[number];

export const periods = ["Q2 2026", "Jun 2026", "H1 2026", "FY 2026"] as const;

export interface Report {
  id: string;
  name: string;
  by: string;
  date: string;
  format: Format;
}

export const initialReports: Report[] = [
  { id: "r1", name: "Portfolio summary — Q2 2026", by: "Admin", date: "Jul 19, 2026", format: "PDF" },
  { id: "r2", name: "Amaq company financial — Jun 2026", by: "Ravi Khanna", date: "Jul 5, 2026", format: "Excel" },
  { id: "r3", name: "Qynda e-commerce performance — Jun 2026", by: "Admin", date: "Jul 3, 2026", format: "PDF" },
  { id: "r4", name: "Bonus register — Q1 2026", by: "HR", date: "Apr 12, 2026", format: "Excel" },
];
