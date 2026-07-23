import type { Tone } from "../../components/ui/Pill";

export const stats = [
  { label: "Portfolio companies", value: "4", caption: "1 per stage · Yoghi, Qynda, Amaq, Camel Glow" },
  { label: "Revenue YTD (full)", value: "$3.18M", delta: { direction: "up" as const, text: "8.2% vs plan" } },
  { label: "Net profit / loss YTD", value: "$412K", delta: { direction: "up" as const, text: "margin 13.0%" } },
  { label: "Jadeite equity-adjusted", value: "$1.61M", caption: "Weighted by ownership %" },
];

export interface CompanyRow {
  code: string;
  name: string;
  color: string;
  stage: string;
  status: { tone: Tone; label: string };
  reason: string;
  updated: string;
}

export const companies: CompanyRow[] = [
  {
    code: "QY",
    name: "Qynda",
    color: "#1B5B41",
    stage: "Active Mgmt",
    status: { tone: "good", label: "On Track" },
    reason: "Gross sales 55% of annual target at half-year",
    updated: "Today",
  },
  {
    code: "AM",
    name: "Amaq",
    color: "#A67C3D",
    stage: "Scaling",
    status: { tone: "warn", label: "Watch" },
    reason: "Marketing spend 21.4% vs 20% approved cap",
    updated: "2h ago",
  },
  {
    code: "YO",
    name: "Yoghi",
    color: "#227450",
    stage: "Growth",
    status: { tone: "good", label: "On Track" },
    reason: "Supplier agreement renewal in progress",
    updated: "Yesterday",
  },
  {
    code: "CG",
    name: "Camel Glow",
    color: "#BE4430",
    stage: "Early",
    status: { tone: "critical", label: "At Risk" },
    reason: "TikTok Ads sync expired · attribution gaps",
    updated: "1d ago",
  },
];

export interface Attention {
  title: string;
  meta: string;
  tone: Tone;
}

export const attention: Attention[] = [
  { title: "Amaq marketing spend above cap", meta: "21.4% actual vs 20% approved · 2h ago", tone: "warn" },
  { title: "Qynda KPI appeal submitted", meta: "D. Osei — Inventory Turnover · 5h ago", tone: "info" },
  { title: "Bonus payment awaiting approval", meta: "4 employees · Q2 2026 · yesterday", tone: "info" },
  { title: "TikTok Ads sync needs reconnect", meta: "Camel Glow · token expired · 1d ago", tone: "critical" },
  { title: "Supplier agreement expiring", meta: "Yoghi · expires in 12 days · 2d ago", tone: "warn" },
];
