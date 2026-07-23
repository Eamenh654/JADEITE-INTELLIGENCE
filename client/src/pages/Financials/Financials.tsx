import { useState } from "react";
import { Card } from "../../components/ui/Card";
import { StatCard } from "../../components/ui/StatCard";
import { Badge } from "../../components/ui/Pill";
import { Icon } from "../../components/ui/Icon";
import { ScopeTag } from "../Employees/parts";
import {
  PERIOD,
  companyPnl,
  financeCompanies,
  fmtUSD,
  ownershipRows,
  reportingCadence,
  stageLabel,
  sumPnl,
  type Pnl,
} from "./data";

type Tab = "standalone" | "consolidated" | "ownership";

const money = (n: number) => (n < 0 ? "-" : "") + fmtUSD(Math.abs(n));

export default function Financials() {
  const [tab, setTab] = useState<Tab>("standalone");

  return (
    <div className="flex flex-col gap-6">
      {/* head + tabs */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-display text-[0.82rem] font-medium italic text-gold-600">Reporting</p>
          <h2 className="mt-0.5 font-display text-[1.6rem] font-bold">Financials</h2>
        </div>
        <div className="thin-scroll flex overflow-x-auto rounded-md border border-line bg-paper-raised p-0.5">
          {(
            [
              { id: "standalone", label: "Standalone" },
              { id: "consolidated", label: "Consolidated Full" },
              { id: "ownership", label: "Jadeite Ownership" },
            ] as const
          ).map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`whitespace-nowrap rounded-[7px] px-3.5 py-1.5 text-[0.82rem] font-semibold transition-colors ${
                tab === t.id ? "bg-jade-100 text-jade-700" : "text-ink-soft hover:bg-paper-sunken"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {tab === "standalone" && <Standalone />}
      {tab === "consolidated" && <Consolidated />}
      {tab === "ownership" && <Ownership />}
    </div>
  );
}

/* ------------------------------ Statement ------------------------- */

function Line({
  label,
  value,
  expense,
  subtotal,
  total,
  margin,
}: {
  label: string;
  value: number;
  expense?: boolean;
  subtotal?: boolean;
  total?: boolean;
  margin?: number;
}) {
  const negative = value < 0;
  const display = (negative ? "(" : "") + fmtUSD(Math.abs(value)) + (negative ? ")" : "");
  const color = total
    ? value >= 0
      ? "text-good"
      : "text-critical"
    : expense
      ? "text-ink-soft"
      : "text-ink";
  return (
    <div
      className={`flex items-baseline justify-between gap-3 py-1.5 ${
        subtotal ? "mt-1 border-t border-line-soft pt-2.5" : ""
      } ${total ? "mt-1 border-t-2 border-line pt-2.5" : ""}`}
    >
      <span className={`text-[0.86rem] ${subtotal || total ? "font-bold" : expense ? "text-ink-soft" : "font-medium"}`}>
        {label}
      </span>
      <span className="flex items-baseline gap-3">
        {margin != null && (
          <span className="tnum w-14 text-right text-[0.72rem] text-ink-faint">{margin.toFixed(1)}%</span>
        )}
        <span className={`tnum w-24 text-right text-[0.9rem] ${subtotal || total ? "font-bold" : ""} ${color}`}>
          {display}
        </span>
      </span>
    </div>
  );
}

function Statement({ pnl, title, meta }: { pnl: Pnl; title: string; meta?: string }) {
  return (
    <Card className="p-5">
      <div className="flex items-baseline justify-between gap-2">
        <h3 className="font-display text-[1.02rem] font-bold">{title}</h3>
        <span className="text-[0.76rem] text-ink-faint">{meta ?? PERIOD}</span>
      </div>
      <div className="mt-3">
        <Line label="Revenue" value={pnl.revenue} />
        <Line label="Cost of goods sold" value={-pnl.cogs} expense />
        <Line label="Gross profit" value={pnl.grossProfit} subtotal margin={pnl.grossMargin} />
        <Line label="Marketing" value={-pnl.marketing} expense />
        <Line label="Payroll" value={-pnl.payroll} expense />
        <Line label="Other operating" value={-pnl.otherOpex} expense />
        <Line label="Net profit / (loss)" value={pnl.netProfit} total margin={pnl.netMargin} />
      </div>
    </Card>
  );
}

/* ------------------------------ Standalone ------------------------ */

function Standalone() {
  const [id, setId] = useState(financeCompanies[0]?.id ?? "");
  const c = financeCompanies.find((x) => x.id === id) ?? financeCompanies[0];
  const pnl = companyPnl(c);

  return (
    <>
      {/* company selector */}
      <div className="thin-scroll -mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1">
        {financeCompanies.map((x) => (
          <button
            key={x.id}
            onClick={() => setId(x.id)}
            className={`inline-flex items-center gap-2 whitespace-nowrap rounded-full border px-3 py-1.5 text-[0.82rem] font-semibold transition-colors ${
              x.id === c.id
                ? "border-jade-500 bg-jade-100 text-jade-700"
                : "border-line bg-paper-raised text-ink-soft hover:bg-paper-sunken"
            }`}
          >
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: x.color }} />
            {x.name}
          </button>
        ))}
      </div>

      {/* cadence note */}
      <div className="flex flex-wrap items-center gap-2.5 rounded-xl border border-line bg-paper-sunken px-4 py-3 text-[0.82rem]">
        <Badge>{stageLabel(c.stage)}</Badge>
        <span className="text-ink-soft">
          Reports <b className="text-ink">{reportingCadence(c.stage)}</b> · last updated {c.updated}
        </span>
        <span className="ml-auto flex items-center gap-1.5 text-ink-faint">
          <Icon name="shield-check" className="h-4 w-4 text-jade-600" /> Figures isolated to this company
        </span>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Revenue" value={money(pnl.revenue)} caption={PERIOD} />
        <StatCard label="Gross margin" value={`${pnl.grossMargin.toFixed(1)}%`} caption={money(pnl.grossProfit)} />
        <StatCard label="Net profit / loss" value={money(pnl.netProfit)} caption={`margin ${pnl.netMargin}%`} />
        <StatCard label="Jadeite ownership" value={`${c.ownership}%`} caption="Equity stake" />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr] lg:items-start">
        <Statement pnl={pnl} title={`${c.name} — income statement`} />
        <Card className="p-5">
          <h3 className="font-display text-[1.02rem] font-bold">Cost structure</h3>
          <p className="mt-0.5 text-[0.8rem] text-ink-soft">Where each revenue dollar goes.</p>
          <div className="mt-4 flex flex-col gap-3">
            <CostBar label="Cost of goods" value={pnl.cogs} total={pnl.revenue} tone="bg-ink-faint" />
            <CostBar label="Marketing" value={pnl.marketing} total={pnl.revenue} tone="bg-gold-500" />
            <CostBar label="Payroll" value={pnl.payroll} total={pnl.revenue} tone="bg-jade-500" />
            <CostBar label="Other operating" value={pnl.otherOpex} total={pnl.revenue} tone="bg-jade-700" />
            <CostBar label="Net profit / loss" value={pnl.netProfit} total={pnl.revenue} tone={pnl.netProfit >= 0 ? "bg-good" : "bg-critical"} />
          </div>
        </Card>
      </div>
    </>
  );
}

function CostBar({ label, value, total, tone }: { label: string; value: number; total: number; tone: string }) {
  const share = total === 0 ? 0 : (value / total) * 100;
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-[0.82rem]">
        <span className="font-medium">{label}</span>
        <span className="tnum text-ink-soft">
          {money(value)} <span className="text-ink-faint">· {share.toFixed(0)}%</span>
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-paper-sunken">
        <div className={`h-full rounded-full ${tone}`} style={{ width: `${Math.max(0, Math.min(share, 100))}%` }} />
      </div>
    </div>
  );
}

/* ---------------------------- Consolidated ------------------------ */

function Consolidated() {
  const pnls = financeCompanies.map(companyPnl);
  const total = sumPnl(pnls);
  const rows = financeCompanies
    .map((c, i) => ({ c, pnl: pnls[i] }))
    .sort((a, b) => b.pnl.revenue - a.pnl.revenue);
  const maxRev = Math.max(...pnls.map((p) => p.revenue));

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total revenue" value={money(total.revenue)} caption={`${financeCompanies.length} operating companies`} />
        <StatCard label="Gross profit" value={money(total.grossProfit)} caption={`${total.grossMargin.toFixed(1)}% margin`} />
        <StatCard label="Net profit" value={money(total.netProfit)} caption={`${total.netMargin.toFixed(1)}% margin`} />
        <StatCard label="Operating costs" value={money(total.opex + total.cogs)} caption="COGS + operating" />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr] lg:items-start">
        <Statement pnl={total} title="Consolidated income statement" meta={`${PERIOD} · 100% basis`} />
        <Card className="p-5">
          <h3 className="font-display text-[1.02rem] font-bold">Revenue by company</h3>
          <p className="mt-0.5 text-[0.8rem] text-ink-soft">Contribution to consolidated revenue.</p>
          <div className="mt-4 flex flex-col gap-3.5">
            {rows.map(({ c, pnl }) => (
              <div key={c.id}>
                <div className="mb-1 flex items-center justify-between text-[0.82rem]">
                  <ScopeTag code={c.code} />
                  <span className="tnum font-semibold">
                    {money(pnl.revenue)}{" "}
                    <span className="text-ink-faint">· {((pnl.revenue / total.revenue) * 100).toFixed(0)}%</span>
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-paper-sunken">
                  <div className="h-full rounded-full" style={{ width: `${(pnl.revenue / maxRev) * 100}%`, backgroundColor: c.color }} />
                </div>
                <p className="mt-1 text-[0.74rem] text-ink-faint">
                  Net {money(pnl.netProfit)} · {pnl.netMargin}% margin
                </p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </>
  );
}

/* ---------------------------- Jadeite Ownership ------------------- */

function Ownership() {
  const rows = ownershipRows();
  const fullTotal = sumPnl(rows.map((r) => r.pnl));
  const shareTotal = sumPnl(rows.map((r) => r.share));
  const blended = (shareTotal.revenue / fullTotal.revenue) * 100;

  return (
    <>
      <div className="flex items-start gap-2 rounded-xl border border-line bg-paper-sunken px-4 py-3 text-[0.82rem] text-ink-soft">
        <Icon name="financials" className="mt-0.5 h-4 w-4 shrink-0 text-jade-600" />
        <span>
          Every figure is weighted by Jadeite's equity stake in each company — the group's true
          economic share, not the 100% consolidated total.
        </span>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Jadeite revenue share" value={money(shareTotal.revenue)} caption={`of ${money(fullTotal.revenue)} full`} />
        <StatCard label="Jadeite net share" value={money(shareTotal.netProfit)} caption={`${shareTotal.netMargin.toFixed(1)}% margin`} />
        <StatCard label="Blended ownership" value={`${blended.toFixed(0)}%`} caption="Revenue-weighted stake" />
        <StatCard label="Companies" value={String(rows.length)} caption="Equity-consolidated" />
      </div>

      <Statement pnl={shareTotal} title="Jadeite equity-adjusted income statement" meta={`${PERIOD} · ownership basis`} />

      <Card>
        <div className="border-b border-line-soft px-5 py-4">
          <h3 className="font-display text-[1.02rem] font-bold">Ownership breakdown</h3>
        </div>
        <div className="thin-scroll overflow-x-auto">
          <table className="w-full text-[0.85rem]">
            <thead>
              <tr className="border-b border-line text-left">
                {["Company", "Ownership", "Revenue (100%)", "Rev share", "Net (100%)", "Net share"].map((h, i) => (
                  <th key={h} className={`whitespace-nowrap px-4 py-2.5 text-[0.7rem] font-bold uppercase tracking-[0.06em] text-ink-faint ${i > 0 ? "text-right" : ""}`}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map(({ company, ownership, pnl, share }) => (
                <tr key={company.id} className="border-b border-line-soft last:border-0">
                  <td className="px-4 py-3"><ScopeTag code={company.code} /></td>
                  <td className="tnum px-4 py-3 text-right font-semibold">{ownership}%</td>
                  <td className="tnum px-4 py-3 text-right text-ink-soft">{money(pnl.revenue)}</td>
                  <td className="tnum px-4 py-3 text-right font-semibold">{money(share.revenue)}</td>
                  <td className="tnum px-4 py-3 text-right text-ink-soft">{money(pnl.netProfit)}</td>
                  <td className={`tnum px-4 py-3 text-right font-semibold ${share.netProfit >= 0 ? "text-good" : "text-critical"}`}>
                    {money(share.netProfit)}
                  </td>
                </tr>
              ))}
              <tr className="bg-paper-sunken/50 font-bold">
                <td className="px-4 py-3">Jadeite total</td>
                <td className="tnum px-4 py-3 text-right">{blended.toFixed(0)}%</td>
                <td className="tnum px-4 py-3 text-right">{money(fullTotal.revenue)}</td>
                <td className="tnum px-4 py-3 text-right text-jade-600">{money(shareTotal.revenue)}</td>
                <td className="tnum px-4 py-3 text-right">{money(fullTotal.netProfit)}</td>
                <td className="tnum px-4 py-3 text-right text-jade-600">{money(shareTotal.netProfit)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
}
