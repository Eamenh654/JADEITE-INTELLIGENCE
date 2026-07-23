import { financeCompanies, fmtUSD } from "../Financials/data";
import type { Tone } from "../../components/ui/Pill";
import type { IconName } from "../../components/ui/Icon";

export { fmtUSD, financeCompanies };

/** Companies that carry live integrations — the operating e-commerce set. */
export const intCompanies = financeCompanies;

export const PERIOD = "Jun 2026";

/* ==================================================================
   §12C.1–12C.3 — Integration Center & connected sources
   ================================================================== */

export type ConnState = "connected" | "partial" | "reconnect" | "pre-launch";
export type Schedule = "Live" | "Hourly" | "Daily" | "Monthly";
export type ConnKind = "commerce" | "marketing" | "finance" | "logistics";

export interface Connector {
  id: string;
  platform: string;
  /** Short avatar tag, e.g. "SHP". */
  abbrev: string;
  /** Brand colour for the avatar. */
  brand: string;
  kind: ConnKind;
  /** What account/scope it is wired to. */
  scope: string;
  /** Owning company, or null when it spans the whole portfolio. */
  companyId: string | null;
  state: ConnState;
  schedule: Schedule;
  lastRefresh: string;
  /** Secondary line — feeds or the current problem. */
  detail: string;
}

export const connStateMeta: Record<ConnState, { tone: Tone; label: string }> = {
  connected: { tone: "good", label: "Connected" },
  partial: { tone: "warn", label: "Partial" },
  reconnect: { tone: "critical", label: "Needs reconnect" },
  "pre-launch": { tone: "neutral", label: "Pre-launch" },
};

export const kindLabel: Record<ConnKind, string> = {
  commerce: "Commerce",
  marketing: "Marketing",
  finance: "Finance",
  logistics: "Logistics",
};

export const connectors: Connector[] = [
  { id: "shp-qynda", platform: "Shopify", abbrev: "SHP", brand: "#95BF47", kind: "commerce", scope: "Qynda store", companyId: "qynda", state: "connected", schedule: "Hourly", lastRefresh: "6 minutes ago", detail: "Orders, products, customers, payouts" },
  { id: "shp-amaq", platform: "Shopify", abbrev: "SHP", brand: "#95BF47", kind: "commerce", scope: "Amaq store", companyId: "amaq", state: "connected", schedule: "Hourly", lastRefresh: "18 minutes ago", detail: "Orders, products, customers, payouts" },
  { id: "shp-cg", platform: "Shopify", abbrev: "SHP", brand: "#95BF47", kind: "commerce", scope: "Camel Glow store", companyId: "camel-glow", state: "connected", schedule: "Hourly", lastRefresh: "1 hour ago", detail: "Orders, products, customers" },
  { id: "shp-yoghi", platform: "Shopify", abbrev: "SHP", brand: "#95BF47", kind: "commerce", scope: "Yoghi store", companyId: "yoghi", state: "pre-launch", schedule: "Hourly", lastRefresh: "—", detail: "No transactional data yet · pre-launch" },
  { id: "meta", platform: "Meta Ads", abbrev: "META", brand: "#1877F2", kind: "marketing", scope: "Facebook & Instagram", companyId: null, state: "connected", schedule: "Hourly", lastRefresh: "22 minutes ago", detail: "Spend, ROAS, campaigns, creatives" },
  { id: "google", platform: "Google Ads", abbrev: "GAD", brand: "#4285F4", kind: "marketing", scope: "All portfolio accounts", companyId: null, state: "connected", schedule: "Daily", lastRefresh: "1 hour ago", detail: "Spend, conversions, conversion value" },
  { id: "tiktok", platform: "TikTok Ads", abbrev: "TIK", brand: "#161616", kind: "marketing", scope: "Camel Glow", companyId: "camel-glow", state: "reconnect", schedule: "Hourly", lastRefresh: "26 hours ago", detail: "Token expired · spend running blind" },
  { id: "erp", platform: "ERP / Accounting", abbrev: "ERP", brand: "#1B5B41", kind: "finance", scope: "All portfolio companies", companyId: null, state: "connected", schedule: "Daily", lastRefresh: "Today, 6:00 AM", detail: "COGS, overheads, financial statements" },
  { id: "ship", platform: "Shipping & Carriers", abbrev: "SHIP", brand: "#B9812A", kind: "logistics", scope: "Outbound + returns", companyId: null, state: "partial", schedule: "Daily", lastRefresh: "Today, 5:30 AM", detail: "Amaq mapping incomplete · 3 SKUs unmatched" },
];

/** Connectors visible for a company filter — company-scoped plus portfolio-wide. */
export function connectorsFor(companyId: string | null): Connector[] {
  if (!companyId) return connectors;
  return connectors.filter((c) => c.companyId === companyId || c.companyId === null);
}

export interface ConnectorSummary {
  total: number;
  connected: number;
  attention: number;
}

export function connectorSummary(list: Connector[]): ConnectorSummary {
  return {
    total: list.length,
    connected: list.filter((c) => c.state === "connected").length,
    attention: list.filter((c) => c.state === "reconnect" || c.state === "partial").length,
  };
}

/* ---- Data-quality issues (12C.1) --------------------------------- */

export interface DataIssue {
  id: string;
  companyId: string;
  issue: string;
  source: string;
  impact: string;
  tone: "critical" | "warn" | "neutral";
  action: string;
}

export const dataIssues: DataIssue[] = [
  { id: "iss-amaq", companyId: "amaq", issue: "3 SKUs unmatched between Shopify and ERP", source: "ERP mapping", impact: "COGS understated", tone: "warn", action: "Resolve" },
  { id: "iss-cg", companyId: "camel-glow", issue: "TikTok access token expired", source: "TikTok Ads", impact: "Spend data stale", tone: "critical", action: "Reconnect" },
  { id: "iss-qynda", companyId: "qynda", issue: "2 refunds pending currency conversion", source: "Shopify → ERP", impact: "Minor", tone: "neutral", action: "Resolve" },
  { id: "iss-yoghi", companyId: "yoghi", issue: "No transactional data yet", source: "—", impact: "Pre-launch", tone: "neutral", action: "N/A" },
];

/* ---- Shopify data areas (12C.2) ---------------------------------- */

export const shopifyAreas: { area: string; use: string }[] = [
  { area: "Orders & sales", use: "Gross sales, net sales, discounts, refunds, taxes, order status, channels and line items." },
  { area: "Products & inventory", use: "Products, SKUs, variants, colours, inventory quantities, locations and product performance." },
  { area: "Customers", use: "Customer profile, first order, repeat orders, new vs returning analysis and customer value." },
  { area: "Fulfilment & returns", use: "Fulfilment status, shipping information, cancellations, returns and operational performance." },
  { area: "Payments & payouts", use: "Payment status, transaction and payout information where the approved access supports it." },
  { area: "Store analytics", use: "Sessions, conversion and other analytics where available, or an approved connected analytics source." },
];

/* ---- Marketing platforms (12C.3) --------------------------------- */

export const marketingPlatforms: { platform: string; data: string }[] = [
  { platform: "Meta Ads — Facebook & Instagram", data: "Campaign, ad set and ad results; spend, impressions, reach, clicks, purchases, CPA, ROAS, frequency and creative." },
  { platform: "Google Ads", data: "Campaign, ad group, keyword or asset performance; spend, impressions, clicks, conversions, conversion value and ROAS." },
  { platform: "TikTok Ads", data: "Campaign, ad group and ad reporting; spend, impressions, clicks, conversions, audience and ROAS where available." },
  { platform: "Other approved platforms", data: "Snapchat, Pinterest, YouTube or future channels selected during technical discovery and supported by official APIs." },
];

/* ---- Admin journey for integrations & AI (12C.7) ----------------- */

export const adminJourney: string[] = [
  "Open Integrations & AI from the main menu.",
  "Select the company and connect its Shopify store, Meta account and other approved sources.",
  "Confirm permissions, currency, timezone, historical period and account mapping.",
  "Run the initial sync and review data completeness, errors and last refresh time.",
  "Open the AI Analytics Center and select the company, period and management question.",
  "Review the AI finding together with its supporting data and limitations.",
  "Create an action, assign an owner, request approval or save the analysis in the monthly report.",
  "Return to the Integration Center whenever a source stops updating or needs renewed access.",
];

/* ==================================================================
   §12C.4 & 12C.6 — AI Analytics Center & safeguards
   ================================================================== */

export interface AiFinding {
  id: string;
  companyId: string;
  severity: "critical" | "warn" | "info";
  /** The management question the finding answers. */
  title: string;
  insight: string;
  /** Sources cited on the answer (12C.6). */
  sources: string[];
  period: string;
  refreshed: string;
  /** Stated limitation or missing data (12C.6). */
  limitation: string;
}

export const severityMeta: Record<AiFinding["severity"], { tone: Tone; label: string }> = {
  critical: { tone: "critical", label: "Needs action" },
  warn: { tone: "warn", label: "Review" },
  info: { tone: "info", label: "Watch" },
};

export const aiFindings: AiFinding[] = [
  {
    id: "f1",
    companyId: "amaq",
    severity: "warn",
    title: "Why did Amaq sales fall in June?",
    insight:
      "Net sales fell 8% month-on-month. The main driver is conversion (−0.4pt) on cold Meta traffic; AOV and returning-customer share held. Blended ROAS slipped to 2.6x against a 3.0x target.",
    sources: ["Shopify", "Meta Ads"],
    period: "Jun 2026",
    refreshed: "22 min ago",
    limitation: "TikTok excluded — not connected for Amaq.",
  },
  {
    id: "f2",
    companyId: "camel-glow",
    severity: "critical",
    title: "Camel Glow spend is running blind",
    insight:
      "TikTok Ads has not synced for 26 hours, so roughly $14K of June spend is unattributed. Reported ROAS is understated and CAC cannot be trusted until the connection is restored.",
    sources: ["TikTok Ads", "Shopify"],
    period: "Jun 2026",
    refreshed: "26 h ago",
    limitation: "TikTok token expired — figures stale since mid-June.",
  },
  {
    id: "f3",
    companyId: "qynda",
    severity: "info",
    title: "Qynda hero SKU approaching stockout",
    insight:
      "Inventory turnover on the hero SKU is elevated and the reorder point is within ~9 days at the current run-rate. A stockout would cap July orders the way it did in April.",
    sources: ["Shopify", "Inventory feed"],
    period: "Jun 2026",
    refreshed: "2 h ago",
    limitation: "Lead-time assumes the standard supplier; expedited option not modelled.",
  },
];

export interface Safeguard {
  icon: IconName;
  title: string;
  body: string;
}

export const safeguards: Safeguard[] = [
  { icon: "lock", title: "Read-only by default", body: "AI cannot change campaigns, targets, KPIs, bonuses, financials or equity without a person taking a separate approved action." },
  { icon: "list", title: "Evidence on every answer", body: "Each answer shows the company, reporting period, data sources, last refresh time and any limitation or missing data." },
  { icon: "external", title: "Traceable to the source", body: "Open the supporting dashboard or the underlying transaction behind any AI finding." },
  { icon: "shield-check", title: "A person decides", body: "Turn a recommendation into a task, comment or approval request — the final decision stays with the authorized person." },
  { icon: "eye", title: "Role & company aware", body: "AI follows the same role, company and sensitive-data restrictions as the rest of the platform." },
  { icon: "check", title: "Approved services only", body: "Sensitive business and employee data is processed only through approved, contractually controlled AI services." },
];

/* ==================================================================
   §12C.8 — Data governance
   ================================================================== */

export const metricDefs: { metric: string; definition: string; source: string }[] = [
  { metric: "Gross sales", definition: "Total order value before discounts, refunds and taxes.", source: "Shopify" },
  { metric: "Net sales", definition: "Gross sales less discounts, refunds and returns.", source: "Shopify" },
  { metric: "Orders", definition: "Count of paid orders in the period, excluding cancellations.", source: "Shopify" },
  { metric: "AOV", definition: "Net sales divided by paid orders.", source: "Derived · Shopify" },
  { metric: "Conversion rate", definition: "Paid orders divided by sessions.", source: "Shopify / analytics" },
  { metric: "Returning customers", definition: "Share of orders from customers with a prior purchase.", source: "Shopify" },
  { metric: "Marketing spend", definition: "Total paid media spend across connected ad platforms.", source: "Ad platforms" },
  { metric: "ROAS", definition: "Attributed revenue divided by marketing spend.", source: "Ad platforms vs Shopify" },
  { metric: "CAC", definition: "Marketing spend divided by newly acquired customers.", source: "Ad platforms + Shopify" },
];

export const sourceOfTruth: { area: string; system: string; note: string }[] = [
  { area: "Commerce transactions", system: "Shopify", note: "Orders, sales, customers, fulfilment." },
  { area: "Financial statements & costs", system: "ERP / Accounting", note: "P&L, COGS, operating overheads." },
  { area: "Ad spend & engagement", system: "Ad platforms", note: "Meta, Google, TikTok reporting." },
  { area: "Actual shipping", system: "Carriers", note: "Outbound deliveries and returns." },
  { area: "Fees & payouts", system: "Payment gateways", note: "Transaction fees and settlement." },
  { area: "Employee data", system: "Approved HR records", note: "People, roles and compensation." },
];

export const governanceRules: string[] = [
  "Original source data is stored separately from adjusted or approved reporting values.",
  "Every manual override needs a reason and is written to the audit history — source data is never overwritten silently.",
  "Integration errors and missing data are shown clearly — the dashboard and AI never guess.",
  "Historical data, account mapping, currency and timezone rules and refresh frequency are maintained per source.",
  "API permissions, platform limits, retention requirements and user privacy are respected.",
  "A complete audit trail covers connections, permissions, overrides, AI reports and actions created from AI.",
];
