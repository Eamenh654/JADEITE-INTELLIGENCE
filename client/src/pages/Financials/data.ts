import { fmtUSD, initialCompanies, stages, type Company, type StageId } from "../Companies/data";

export { fmtUSD };

/** Operating companies only — pipeline opportunities and archived exits excluded. */
export const financeCompanies: Company[] = initialCompanies.filter(
  (c) => !c.archived && c.stage !== "pipeline",
);

export const PERIOD = "H1 2026 · YTD";

/** Assumed gross margin by company, used to give the P&L structure. */
const grossMarginById: Record<string, number> = {
  qynda: 0.44,
  yoghi: 0.4,
  amaq: 0.46,
  "camel-glow": 0.32,
};

export interface Pnl {
  revenue: number;
  cogs: number;
  grossProfit: number;
  grossMargin: number;
  marketing: number;
  payroll: number;
  otherOpex: number;
  opex: number;
  netProfit: number;
  netMargin: number;
}

/** Build a company P&L; net reconciles to the company's stored net margin. */
export function companyPnl(c: Company): Pnl {
  const revenue = c.revenue ?? 0;
  const gm = grossMarginById[c.id] ?? 0.4;
  const grossProfit = Math.round(revenue * gm);
  const cogs = revenue - grossProfit;
  const netProfit = Math.round(revenue * ((c.margin ?? 0) / 100));
  const opex = grossProfit - netProfit;
  const marketing = Math.round(opex * 0.4);
  const payroll = Math.round(opex * 0.4);
  const otherOpex = opex - marketing - payroll;
  return {
    revenue,
    cogs,
    grossProfit,
    grossMargin: gm * 100,
    marketing,
    payroll,
    otherOpex,
    opex,
    netProfit,
    netMargin: c.margin ?? 0,
  };
}

const pct = (part: number, whole: number) => (whole === 0 ? 0 : (part / whole) * 100);

/** Scale every amount by a factor (e.g. ownership %); margins are unchanged. */
export function scalePnl(p: Pnl, f: number): Pnl {
  return {
    revenue: Math.round(p.revenue * f),
    cogs: Math.round(p.cogs * f),
    grossProfit: Math.round(p.grossProfit * f),
    grossMargin: p.grossMargin,
    marketing: Math.round(p.marketing * f),
    payroll: Math.round(p.payroll * f),
    otherOpex: Math.round(p.otherOpex * f),
    opex: Math.round(p.opex * f),
    netProfit: Math.round(p.netProfit * f),
    netMargin: p.netMargin,
  };
}

/** Sum P&Ls and recompute margins from the totals. */
export function sumPnl(list: Pnl[]): Pnl {
  const t = list.reduce(
    (a, p) => ({
      revenue: a.revenue + p.revenue,
      cogs: a.cogs + p.cogs,
      grossProfit: a.grossProfit + p.grossProfit,
      marketing: a.marketing + p.marketing,
      payroll: a.payroll + p.payroll,
      otherOpex: a.otherOpex + p.otherOpex,
      opex: a.opex + p.opex,
      netProfit: a.netProfit + p.netProfit,
    }),
    { revenue: 0, cogs: 0, grossProfit: 0, marketing: 0, payroll: 0, otherOpex: 0, opex: 0, netProfit: 0 },
  );
  return {
    ...t,
    grossMargin: pct(t.grossProfit, t.revenue),
    netMargin: pct(t.netProfit, t.revenue),
  };
}

/** Reporting cadence set by portfolio stage (spec §10). */
export function reportingCadence(stage: StageId): string {
  if (stage === "active" || stage === "growth") return "Monthly";
  if (stage === "rnd") return "Quarterly";
  return "On milestone";
}

export const stageLabel = (id: StageId): string =>
  stages.find((s) => s.id === id)?.label ?? id;

export interface OwnershipRow {
  company: Company;
  ownership: number;
  pnl: Pnl;
  share: Pnl;
}

/** Per-company full vs Jadeite-share figures for the ownership view. */
export function ownershipRows(): OwnershipRow[] {
  return financeCompanies.map((c) => {
    const pnl = companyPnl(c);
    return { company: c, ownership: c.ownership, pnl, share: scalePnl(pnl, c.ownership / 100) };
  });
}
