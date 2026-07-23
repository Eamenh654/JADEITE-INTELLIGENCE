import type { Tone } from "../../components/ui/Pill";

/** The four portfolio stages a company moves through (Front matter §A). */
export type StageId = "rnd" | "active" | "growth" | "pipeline";

export interface Stage {
  id: StageId;
  label: string;
  /** One-line description of what the stage means for reporting cadence. */
  blurb: string;
}

export const stages: Stage[] = [
  {
    id: "rnd",
    label: "Startup / R&D",
    blurb: "Early build — validating product and unit economics before scale.",
  },
  {
    id: "active",
    label: "Active Management",
    blurb: "Operating and reported monthly — the core of the portfolio.",
  },
  {
    id: "growth",
    label: "Growth",
    blurb: "Proven and scaling — spend, margin and supply under close watch.",
  },
  {
    id: "pipeline",
    label: "Pipeline",
    blurb: "Opportunities in due diligence, not yet converted to a company.",
  },
];

export interface Company {
  id: string;
  code: string;
  name: string;
  color: string;
  sector: string;
  stage: StageId;
  /** Jadeite ownership, %. */
  ownership: number;
  status: { tone: Tone; label: string };
  /** Revenue YTD in USD; null while a pipeline opportunity. */
  revenue: number | null;
  /** Net margin %, null when pre-revenue. */
  margin: number | null;
  employees: number;
  updated: string;
  archived?: boolean;
  /** Present on pipeline opportunities only. */
  diligence?: { label: string; progress: number };
}

export const initialCompanies: Company[] = [
  {
    id: "qynda",
    code: "QY",
    name: "Qynda",
    color: "#1B5B41",
    sector: "Beverages",
    stage: "active",
    ownership: 70,
    status: { tone: "good", label: "On Track" },
    revenue: 1_420_000,
    margin: 15.8,
    employees: 34,
    updated: "Today",
  },
  {
    id: "yoghi",
    code: "YO",
    name: "Yoghi",
    color: "#227450",
    sector: "Dairy & Chilled",
    stage: "growth",
    ownership: 55,
    status: { tone: "good", label: "On Track" },
    revenue: 980_000,
    margin: 12.1,
    employees: 22,
    updated: "Yesterday",
  },
  {
    id: "amaq",
    code: "AM",
    name: "Amaq",
    color: "#A67C3D",
    sector: "Home & Living",
    stage: "growth",
    ownership: 40,
    status: { tone: "warn", label: "Watch" },
    revenue: 600_000,
    margin: 9.3,
    employees: 15,
    updated: "2h ago",
  },
  {
    id: "camel-glow",
    code: "CG",
    name: "Camel Glow",
    color: "#BE4430",
    sector: "Skincare",
    stage: "rnd",
    ownership: 100,
    status: { tone: "critical", label: "At Risk" },
    revenue: 180_000,
    margin: -4.2,
    employees: 6,
    updated: "1d ago",
  },
  {
    id: "aloe-nordic",
    code: "AN",
    name: "Aloé Nordic",
    color: "#2E9C6B",
    sector: "Skincare",
    stage: "pipeline",
    ownership: 60,
    status: { tone: "info", label: "Due Diligence" },
    revenue: null,
    margin: null,
    employees: 9,
    updated: "3d ago",
    diligence: { label: "Financials & data-room review", progress: 70 },
  },
  {
    id: "verdant-foods",
    code: "VF",
    name: "Verdant Foods",
    color: "#8C6A34",
    sector: "Plant-based",
    stage: "pipeline",
    ownership: 45,
    status: { tone: "neutral", label: "Initial Review" },
    revenue: null,
    margin: null,
    employees: 12,
    updated: "5d ago",
    diligence: { label: "First screen — pending management call", progress: 30 },
  },
  {
    id: "lumen-optics",
    code: "LO",
    name: "Lumen Optics",
    color: "#54655A",
    sector: "Eyewear",
    stage: "growth",
    ownership: 35,
    status: { tone: "neutral", label: "Exited" },
    revenue: 1_050_000,
    margin: 11.4,
    employees: 0,
    updated: "Dec 2025",
    archived: true,
  },
];

/** Compact USD formatter — $1.42M / $180K / $0. */
export function fmtUSD(n: number | null): string {
  if (n == null) return "—";
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `$${Math.round(n / 1_000)}K`;
  return `$${n}`;
}
