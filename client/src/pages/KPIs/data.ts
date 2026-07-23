import type { Tone } from "../../components/ui/Pill";
import { initialEmployees } from "../Employees/data";

export type KpiFormat = "usd" | "pct" | "x" | "num";

/* ---- Formatting & scoring helpers ---------------------------------- */

export function fmtVal(v: number | null, format: KpiFormat): string {
  if (v == null) return "—";
  switch (format) {
    case "usd":
      if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(2)}M`;
      if (v >= 1_000) return `$${Math.round(v / 1_000)}K`;
      return `$${v}`;
    case "pct":
      return `${v}%`;
    case "x":
      return `${v}x`;
    default:
      return v.toLocaleString();
  }
}

/** Attainment as a 0–1.5 ratio; respects lower-is-better metrics. */
export function attainment(
  target: number,
  actual: number | null,
  higherIsBetter = true,
): number | null {
  if (actual == null || target === 0) return null;
  const ratio = higherIsBetter ? actual / target : target / actual;
  return Math.max(0, Math.min(ratio, 1.5));
}

export function statusFor(ratio: number | null): { tone: Tone; label: string } {
  if (ratio == null) return { tone: "neutral", label: "Pending" };
  if (ratio >= 1) return { tone: "good", label: "On Track" };
  if (ratio >= 0.9) return { tone: "warn", label: "Watch" };
  return { tone: "critical", label: "Behind" };
}

/* ---- Company KPIs (spec §7) ---------------------------------------- */

export interface CompanyKpi {
  id: string;
  name: string;
  companyCode: string;
  owner: string;
  format: KpiFormat;
  target: number;
  actual: number;
  period: string;
  higherIsBetter?: boolean;
  trend: "up" | "down" | "flat";
}

export const companyKpis: CompanyKpi[] = [
  { id: "qy-sales", name: "Gross Sales vs Target", companyCode: "QY", owner: "Lena Park", format: "usd", target: 1_300_000, actual: 1_420_000, period: "H1 2026", trend: "up" },
  { id: "qy-margin", name: "Gross Margin", companyCode: "QY", owner: "Lena Park", format: "pct", target: 16, actual: 15.8, period: "H1 2026", trend: "flat" },
  { id: "qy-turnover", name: "Inventory Turnover", companyCode: "QY", owner: "David Osei", format: "x", target: 6, actual: 5.4, period: "H1 2026", trend: "down" },
  { id: "am-spend", name: "Marketing Spend Ratio", companyCode: "AM", owner: "Priya Nair", format: "pct", target: 20, actual: 21.4, period: "H1 2026", higherIsBetter: false, trend: "up" },
  { id: "am-roas", name: "Blended ROAS", companyCode: "AM", owner: "Priya Nair", format: "x", target: 3, actual: 2.7, period: "H1 2026", trend: "down" },
  { id: "am-rev", name: "Revenue vs Target", companyCode: "AM", owner: "Priya Nair", format: "usd", target: 620_000, actual: 600_000, period: "H1 2026", trend: "flat" },
  { id: "yo-rev", name: "Revenue vs Target", companyCode: "YO", owner: "Sara Haddad", format: "usd", target: 900_000, actual: 980_000, period: "H1 2026", trend: "up" },
  { id: "yo-supplier", name: "Supplier On-time", companyCode: "YO", owner: "Tom Becker", format: "pct", target: 95, actual: 92, period: "H1 2026", trend: "down" },
  { id: "cg-burn", name: "Burn vs Plan", companyCode: "CG", owner: "Nadia Reza", format: "usd", target: 200_000, actual: 210_000, period: "H1 2026", higherIsBetter: false, trend: "up" },
  { id: "cg-launch", name: "Launch Readiness", companyCode: "CG", owner: "Nadia Reza", format: "pct", target: 100, actual: 62, period: "H1 2026", trend: "up" },
];

/* ---- Quarterly employee review (spec §8) --------------------------- */

export const reviewStages = [
  { label: "KPI Setup", hint: "Targets agreed" },
  { label: "Self-Assessment", hint: "Employee enters actuals" },
  { label: "Manager Review", hint: "Manager scores" },
  { label: "Calibration", hint: "Normalised across companies" },
  { label: "Approval", hint: "Owner signs off" },
  { label: "Published", hint: "Shared · feeds bonus" },
] as const;

export type AppealStatus = "open" | "review" | "resolved";

export interface Appeal {
  status: AppealStatus;
  reason: string;
  filed: string;
  outcome?: string;
}

export interface EmpKpi {
  id: string;
  name: string;
  weight: number;
  format: KpiFormat;
  target: number;
  actual: number | null;
  higherIsBetter?: boolean;
  appeal?: Appeal;
}

export interface Review {
  employeeId: string;
  quarter: string;
  stage: number;
  kpis: EmpKpi[];
}

export const QUARTER = "Q2 2026";

export const initialReviews: Review[] = [
  {
    employeeId: "david-osei",
    quarter: QUARTER,
    stage: 2,
    kpis: [
      {
        id: "do-turnover",
        name: "Inventory Turnover",
        weight: 40,
        format: "x",
        target: 6,
        actual: 5.4,
        appeal: {
          status: "open",
          reason: "Stockouts driven by a supplier delay outside my control.",
          filed: "5h ago",
        },
      },
      { id: "do-fulfil", name: "On-time Fulfilment", weight: 35, format: "pct", target: 96, actual: 94 },
      { id: "do-accuracy", name: "Stock Accuracy", weight: 25, format: "pct", target: 99, actual: 98.5 },
    ],
  },
  {
    employeeId: "lena-park",
    quarter: QUARTER,
    stage: 4,
    kpis: [
      { id: "lp-margin", name: "Gross Margin", weight: 40, format: "pct", target: 16, actual: 15.8 },
      { id: "lp-report", name: "Reporting Timeliness", weight: 30, format: "pct", target: 100, actual: 100 },
      { id: "lp-ccc", name: "Cash Conversion Cycle (days)", weight: 30, format: "num", target: 45, actual: 41, higherIsBetter: false },
    ],
  },
  {
    employeeId: "sara-haddad",
    quarter: QUARTER,
    stage: 3,
    kpis: [
      { id: "sh-rev", name: "Revenue vs Target", weight: 50, format: "usd", target: 900_000, actual: 980_000 },
      { id: "sh-retention", name: "Team Retention", weight: 25, format: "pct", target: 90, actual: 95 },
      { id: "sh-nps", name: "Customer NPS", weight: 25, format: "num", target: 40, actual: 44 },
    ],
  },
  {
    employeeId: "priya-nair",
    quarter: QUARTER,
    stage: 1,
    kpis: [
      { id: "pn-ncac", name: "nCAC", weight: 40, format: "usd", target: 28, actual: 31, higherIsBetter: false },
      { id: "pn-roas", name: "Blended ROAS", weight: 35, format: "x", target: 3, actual: 2.7 },
      { id: "pn-hook", name: "Hook Rate", weight: 25, format: "pct", target: 30, actual: 33 },
    ],
  },
  {
    employeeId: "nadia-reza",
    quarter: QUARTER,
    stage: 0,
    kpis: [
      { id: "nr-launch", name: "Launch Milestones", weight: 60, format: "pct", target: 100, actual: null },
      { id: "nr-burn", name: "Burn vs Plan", weight: 40, format: "usd", target: 60_000, actual: null, higherIsBetter: false },
    ],
  },
  {
    employeeId: "marco-ruiz",
    quarter: QUARTER,
    stage: 5,
    kpis: [
      { id: "mr-cvr", name: "Conversion Rate", weight: 40, format: "pct", target: 2.5, actual: 2.8 },
      { id: "mr-aov", name: "Average Order Value", weight: 30, format: "usd", target: 48, actual: 52 },
      { id: "mr-return", name: "Return Rate", weight: 30, format: "pct", target: 8, actual: 6.5, higherIsBetter: false },
    ],
  },
];

const empById = Object.fromEntries(initialEmployees.map((e) => [e.id, e]));
export const reviewEmployee = (id: string) => empById[id];

/** Weighted attainment across scored KPIs, as a 0–150 percentage. */
export function weightedScore(kpis: EmpKpi[]): number | null {
  const scored = kpis.filter((k) => k.actual != null);
  const totalWeight = scored.reduce((s, k) => s + k.weight, 0);
  if (totalWeight === 0) return null;
  const sum = scored.reduce(
    (s, k) => s + (attainment(k.target, k.actual, k.higherIsBetter) ?? 0) * k.weight,
    0,
  );
  return Math.round((sum / totalWeight) * 100);
}
