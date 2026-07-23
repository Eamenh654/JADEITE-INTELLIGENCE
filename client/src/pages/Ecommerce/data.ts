import { fmtUSD, financeCompanies } from "../Financials/data";
import type { Company } from "../Companies/data";

export { fmtUSD };

export const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"] as const;
/** Months elapsed in the year through the current period. */
export const MONTHS_ELAPSED = 6;
export const PERIOD = "Jan – Jun 2026";

export interface EcomMonth {
  month: string;
  revenue: number;
  target: number;
  orders: number;
  sessions: number;
}

export interface EcomUpdate {
  month: string;
  author: string;
  date: string;
  note: string;
}

interface EcomConfig {
  annualTarget: number;
  /** H1 actual online revenue — matches the company's stored revenue. */
  h1: number;
  aov: number;
  conv: number;
  updates: EcomUpdate[];
}

const config: Record<string, EcomConfig> = {
  qynda: {
    annualTarget: 2_580_000,
    h1: 1_420_000,
    aov: 52,
    conv: 0.028,
    updates: [
      { month: "Jun", author: "Marco Ruiz", date: "1 Jul", note: "Strong June — the summer 3-pack bundle lifted AOV and drove +4% MoM revenue. Paid social ROAS held above 3.0." },
      { month: "May", author: "Marco Ruiz", date: "2 Jun", note: "Conversion improved after the PDP redesign. Email flows now 22% of revenue." },
      { month: "Apr", author: "Marco Ruiz", date: "2 May", note: "Steady month. Slight stockout on the hero SKU mid-month capped orders." },
    ],
  },
  yoghi: {
    annualTarget: 1_900_000,
    h1: 980_000,
    aov: 44,
    conv: 0.024,
    updates: [
      { month: "Jun", author: "Sara Haddad", date: "1 Jul", note: "On pace for the annual target. Subscription cohort growing steadily; churn under 5%." },
      { month: "May", author: "Sara Haddad", date: "2 Jun", note: "New chilled range launched to positive reviews. Retention KPI ahead of target." },
    ],
  },
  amaq: {
    annualTarget: 1_350_000,
    h1: 600_000,
    aov: 38,
    conv: 0.021,
    updates: [
      { month: "Jun", author: "Priya Nair", date: "1 Jul", note: "Behind annual pace. Blended ROAS slipped to 2.7 and spend ran 21.4% vs the 20% cap — tightening budgets in July." },
      { month: "May", author: "Priya Nair", date: "2 Jun", note: "Creative refresh underway to improve hook rate; CAC trending up on cold traffic." },
    ],
  },
  "camel-glow": {
    annualTarget: 520_000,
    h1: 180_000,
    aov: 33,
    conv: 0.018,
    updates: [
      { month: "Jun", author: "Nadia Reza", date: "1 Jul", note: "Early-stage brand. TikTok Ads sync expired mid-month causing attribution gaps — reconnect scheduled. Below pace but learning fast." },
      { month: "May", author: "Nadia Reza", date: "2 Jun", note: "First influencer seeding round drove a spike in sessions; conversion still maturing." },
    ],
  },
};

/** Ramp weights so revenue grows month over month across H1 (sum = 6). */
const weights = [0.9, 0.95, 1.0, 1.03, 1.05, 1.07];
const sumW = weights.reduce((a, b) => a + b, 0);

function buildMonths(c: EcomConfig): EcomMonth[] {
  const monthlyTarget = Math.round(c.annualTarget / 12);
  return MONTHS.map((month, i) => {
    const revenue = Math.round((c.h1 * weights[i]) / sumW);
    const orders = Math.round(revenue / c.aov);
    const sessions = Math.round(orders / c.conv);
    return { month, revenue, target: monthlyTarget, orders, sessions };
  });
}

export interface EcomSummary {
  revenue: number;
  orders: number;
  sessions: number;
  aov: number;
  conversion: number;
  h1Target: number;
  annualTarget: number;
  attainmentAnnual: number;
  deltaVsTarget: number;
}

export interface EcomView {
  company: Company;
  months: EcomMonth[];
  updates: EcomUpdate[];
  summary: EcomSummary;
}

export const ecomCompanies = financeCompanies;

export function getEcom(companyId: string): EcomView | null {
  const company = financeCompanies.find((c) => c.id === companyId);
  const cfg = config[companyId];
  if (!company || !cfg) return null;

  const months = buildMonths(cfg);
  const revenue = months.reduce((s, m) => s + m.revenue, 0);
  const orders = months.reduce((s, m) => s + m.orders, 0);
  const sessions = months.reduce((s, m) => s + m.sessions, 0);
  const h1Target = months.reduce((s, m) => s + m.target, 0);

  return {
    company,
    months,
    updates: cfg.updates,
    summary: {
      revenue,
      orders,
      sessions,
      aov: orders === 0 ? 0 : revenue / orders,
      conversion: sessions === 0 ? 0 : (orders / sessions) * 100,
      h1Target,
      annualTarget: cfg.annualTarget,
      attainmentAnnual: (revenue / cfg.annualTarget) * 100,
      deltaVsTarget: h1Target === 0 ? 0 : ((revenue - h1Target) / h1Target) * 100,
    },
  };
}

/* ==================================================================
   §12A — data & approval, campaigns, comparison, alerts
   ================================================================== */

/* ---- 12.6 Monthly approval journey (Draft → Locked) -------------- */

export type MonthStatus = "draft" | "submitted" | "approved" | "locked";

export const approvalStages: { id: MonthStatus; label: string; hint: string }[] = [
  { id: "draft", label: "Draft", hint: "Synced & manual figures entered" },
  { id: "submitted", label: "Submitted", hint: "Sent for company review" },
  { id: "approved", label: "Approved", hint: "Manager signed off" },
  { id: "locked", label: "Locked", hint: "Final — feeds reporting" },
];

export const statusMeta: Record<MonthStatus, { label: string; tone: "good" | "warn" | "info" | "neutral" }> = {
  draft: { label: "Draft", tone: "warn" },
  submitted: { label: "Submitted", tone: "info" },
  approved: { label: "Approved", tone: "info" },
  locked: { label: "Locked", tone: "good" },
};

/** Month statuses seeded per company — earlier months locked, June open. */
export function seedMonthStatuses(): Record<string, MonthStatus> {
  return { Jan: "locked", Feb: "locked", Mar: "locked", Apr: "locked", May: "locked", Jun: "draft" };
}

/* ---- 12.6 Data sources (integrations + manual entry) ------------- */

export type SourceState = "synced" | "expired" | "manual";

export interface DataSource {
  name: string;
  feeds: string;
  state: SourceState;
  meta: string;
}

export function dataSources(companyId: string): DataSource[] {
  const tiktok: DataSource =
    companyId === "camel-glow"
      ? { name: "TikTok Ads", feeds: "Ad spend, ROAS", state: "expired", meta: "Token expired · reconnect needed" }
      : { name: "TikTok Ads", feeds: "Ad spend, ROAS", state: "synced", meta: "Synced 4h ago" };
  return [
    { name: "Shopify", feeds: "Revenue, orders, sessions", state: "synced", meta: "Synced 2h ago" },
    { name: "Meta Ads", feeds: "Ad spend, ROAS", state: "synced", meta: "Synced 3h ago" },
    { name: "Google Ads", feeds: "Ad spend", state: "synced", meta: "Synced 5h ago" },
    tiktok,
    { name: "Manual entry", feeds: "Returns, wholesale, adjustments", state: "manual", meta: "Edited by analyst · 1d ago" },
  ];
}

/* ---- 12.9 Campaign Performance ----------------------------------- */

export type Channel = "Meta" | "Google" | "TikTok" | "Email" | "Influencer";
export type CampaignStatus = "active" | "paused" | "ended" | "attention";

export const channelColor: Record<Channel, string> = {
  Meta: "#3C6EA0",
  Google: "#B9812A",
  TikTok: "#BE4430",
  Email: "#227450",
  Influencer: "#A67C3D",
};

export interface Campaign {
  id: string;
  name: string;
  channel: Channel;
  spend: number;
  revenue: number;
  orders: number;
  status: CampaignStatus;
}

const campaignConfig: Record<string, Campaign[]> = {
  qynda: [
    { id: "qy-meta", name: "Meta · Prospecting", channel: "Meta", spend: 42_000, revenue: 128_000, orders: 2_400, status: "active" },
    { id: "qy-goog", name: "Google · Brand + PMax", channel: "Google", spend: 26_000, revenue: 96_000, orders: 1_750, status: "active" },
    { id: "qy-tt", name: "TikTok · Summer Bundle", channel: "TikTok", spend: 18_000, revenue: 49_000, orders: 900, status: "active" },
    { id: "qy-email", name: "Email · Lifecycle flows", channel: "Email", spend: 3_000, revenue: 61_000, orders: 1_150, status: "active" },
  ],
  yoghi: [
    { id: "yo-meta", name: "Meta · Subscription push", channel: "Meta", spend: 30_000, revenue: 84_000, orders: 1_900, status: "active" },
    { id: "yo-goog", name: "Google · Search", channel: "Google", spend: 18_000, revenue: 58_000, orders: 1_300, status: "active" },
    { id: "yo-email", name: "Email · Retention", channel: "Email", spend: 2_500, revenue: 44_000, orders: 1_000, status: "active" },
  ],
  amaq: [
    { id: "am-meta", name: "Meta · Cold prospecting", channel: "Meta", spend: 38_000, revenue: 96_000, orders: 2_100, status: "active" },
    { id: "am-tt", name: "TikTok · Creator seeding", channel: "TikTok", spend: 22_000, revenue: 52_000, orders: 1_050, status: "active" },
    { id: "am-goog", name: "Google · PMax", channel: "Google", spend: 15_000, revenue: 47_000, orders: 1_150, status: "paused" },
  ],
  "camel-glow": [
    { id: "cg-tt", name: "TikTok · Awareness", channel: "TikTok", spend: 14_000, revenue: 22_000, orders: 620, status: "attention" },
    { id: "cg-meta", name: "Meta · Retargeting", channel: "Meta", spend: 8_000, revenue: 19_000, orders: 540, status: "active" },
    { id: "cg-inf", name: "Influencer · Seeding", channel: "Influencer", spend: 6_000, revenue: 12_000, orders: 340, status: "ended" },
  ],
};

export const getCampaigns = (companyId: string): Campaign[] => campaignConfig[companyId] ?? [];

export interface CampaignTotals {
  spend: number;
  revenue: number;
  orders: number;
  roas: number;
  cac: number;
}

export function campaignTotals(companyId: string): CampaignTotals {
  const cs = getCampaigns(companyId);
  const spend = cs.reduce((s, c) => s + c.spend, 0);
  const revenue = cs.reduce((s, c) => s + c.revenue, 0);
  const orders = cs.reduce((s, c) => s + c.orders, 0);
  return { spend, revenue, orders, roas: spend ? revenue / spend : 0, cac: orders ? spend / orders : 0 };
}

/* ---- 12.8 Alerts -------------------------------------------------- */

export interface EcomAlert {
  id: string;
  companyId: string;
  code: string;
  tone: "critical" | "warn" | "info";
  title: string;
  detail: string;
  action: string;
}

/* ---- 12B / Appendix A2 — CM1–CM5 True Profit waterfall ----------- */

const grossMarginById: Record<string, number> = {
  qynda: 0.44,
  yoghi: 0.4,
  amaq: 0.46,
  "camel-glow": 0.32,
};
const FULFIL_RATE = 0.08;
const FEE_RATE = 0.029;
const OVERHEAD_RATE = 0.1;

export type WfKind = "base" | "deduction" | "margin";

export interface WfRow {
  key: string;
  label: string;
  kind: WfKind;
  amount: number;
  pct?: number;
  level?: number;
  /** Deeper profitability — masked for restricted roles. */
  restricted?: boolean;
}

export interface Waterfall {
  netSales: number;
  rows: WfRow[];
  marketing: number;
  overhead: number;
  cm1: number;
  cm4: number;
  cm5: number;
  marketingPct: number;
}

export function profitWaterfall(companyId: string): Waterfall {
  const view = getEcom(companyId);
  const netSales = view?.summary.revenue ?? 0;
  const gm = grossMarginById[companyId] ?? 0.4;
  const cogs = Math.round(netSales * (1 - gm));
  const fulfil = Math.round(netSales * FULFIL_RATE);
  const fees = Math.round(netSales * FEE_RATE);
  const marketing = campaignTotals(companyId).spend;
  const overhead = Math.round(netSales * OVERHEAD_RATE);

  const cm1 = netSales - cogs;
  const cm2 = cm1 - fulfil;
  const cm3 = cm2 - fees;
  const cm4 = cm3 - marketing;
  const cm5 = cm4 - overhead;
  const p = (v: number) => (netSales ? (v / netSales) * 100 : 0);

  const rows: WfRow[] = [
    { key: "net", label: "Net sales", kind: "base", amount: netSales, pct: 100 },
    { key: "cogs", label: "Cost of goods", kind: "deduction", amount: cogs },
    { key: "cm1", label: "CM1 · after product", kind: "margin", amount: cm1, pct: p(cm1), level: 1 },
    { key: "fulfil", label: "Fulfilment & shipping", kind: "deduction", amount: fulfil },
    { key: "cm2", label: "CM2 · after fulfilment", kind: "margin", amount: cm2, pct: p(cm2), level: 2 },
    { key: "fees", label: "Payment & transaction fees", kind: "deduction", amount: fees },
    { key: "cm3", label: "CM3 · after fees", kind: "margin", amount: cm3, pct: p(cm3), level: 3 },
    { key: "mkt", label: "Marketing & advertising", kind: "deduction", amount: marketing },
    { key: "cm4", label: "CM4 · after marketing", kind: "margin", amount: cm4, pct: p(cm4), level: 4 },
    { key: "oh", label: "Operating overheads", kind: "deduction", amount: overhead, restricted: true },
    { key: "cm5", label: "CM5 · true profit", kind: "margin", amount: cm5, pct: p(cm5), level: 5, restricted: true },
  ];

  return { netSales, rows, marketing, overhead, cm1, cm4, cm5, marketingPct: p(marketing) };
}

export const initialAlerts: EcomAlert[] = [
  { id: "a1", companyId: "camel-glow", code: "CG", tone: "critical", title: "TikTok Ads sync expired", detail: "Attribution gaps since mid-June — spend still running blind.", action: "Reconnect integration" },
  { id: "a2", companyId: "camel-glow", code: "CG", tone: "warn", title: "Behind annual pace", detail: "35% of annual target at half-year vs 50% expected.", action: "Review targets" },
  { id: "a3", companyId: "amaq", code: "AM", tone: "warn", title: "Marketing spend above cap", detail: "21.4% of revenue vs the 20% approved cap.", action: "Tighten budgets" },
  { id: "a4", companyId: "amaq", code: "AM", tone: "warn", title: "Blended ROAS below target", detail: "2.6x vs 3.0x target on paid social.", action: "Refresh creative" },
  { id: "a5", companyId: "qynda", code: "QY", tone: "info", title: "Hero SKU stockout risk", detail: "Inventory turnover elevated — reorder point approaching.", action: "Check inventory" },
];
