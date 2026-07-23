import { useState } from "react";
import { Card } from "../../components/ui/Card";
import { StatCard } from "../../components/ui/StatCard";
import { Pill } from "../../components/ui/Pill";
import { Icon } from "../../components/ui/Icon";
import { fmtUSD, profitWaterfall, type EcomView, type WfRow } from "./data";

type Role = "owner" | "manager" | "analyst";

const roles: { id: Role; label: string; full: boolean }[] = [
  { id: "owner", label: "Owner", full: true },
  { id: "manager", label: "Company Manager", full: true },
  { id: "analyst", label: "Analyst", full: false },
];

const laterPhase = [
  "Cohort LTV & payback period",
  "New-customer CAC vs blended CAC",
  "Inventory-adjusted contribution margin",
  "Contribution by SKU and destination country",
];

export function ProfitabilitySection({ view }: { view: EcomView }) {
  const [role, setRole] = useState<Role>("owner");
  const wf = profitWaterfall(view.company.id);
  const full = roles.find((r) => r.id === role)?.full ?? false;

  const marginColor = (v: number) => (v >= 0 ? "text-good" : "text-critical");

  return (
    <>
      {/* role switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="flex items-center gap-2 text-[0.82rem] text-ink-soft">
          <Icon name="lock" className="h-4 w-4 text-jade-600" />
          Advanced profitability — visibility depends on role
        </p>
        <div className="flex items-center gap-2">
          <span className="text-[0.76rem] text-ink-faint">View as</span>
          <div className="flex rounded-md border border-line bg-paper-raised p-0.5">
            {roles.map((r) => (
              <button
                key={r.id}
                onClick={() => setRole(r.id)}
                className={`rounded-[7px] px-2.5 py-1 text-[0.76rem] font-semibold transition-colors ${
                  role === r.id ? "bg-jade-100 text-jade-700" : "text-ink-soft hover:bg-paper-sunken"
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {!full && (
        <div className="flex items-start gap-2 rounded-xl border border-warn-bg bg-warn-bg/50 px-4 py-3 text-[0.82rem] text-ink-soft">
          <Icon name="lock" className="mt-0.5 h-4 w-4 shrink-0 text-warn" />
          Overheads and CM5 true profit are restricted for the Analyst role. Contribution through
          CM4 (after marketing) is shown.
        </div>
      )}

      {/* tiles */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="CM1 · gross margin" value={`${((wf.cm1 / wf.netSales) * 100).toFixed(1)}%`} caption={fmtUSD(wf.cm1)} />
        <StatCard label="CM4 · after marketing" value={`${((wf.cm4 / wf.netSales) * 100).toFixed(1)}%`} caption={fmtUSD(wf.cm4)} />
        <StatCard label="Marketing % of sales" value={`${wf.marketingPct.toFixed(1)}%`} caption={fmtUSD(wf.marketing)} />
        {full ? (
          <StatCard label="CM5 · true profit" value={`${((wf.cm5 / wf.netSales) * 100).toFixed(1)}%`} caption={fmtUSD(wf.cm5)} />
        ) : (
          <RestrictedTile />
        )}
      </div>

      {/* waterfall ladder */}
      <Card className="p-5">
        <div className="flex items-baseline justify-between">
          <h3 className="font-display text-[1.02rem] font-bold">True Profit waterfall</h3>
          <span className="text-[0.76rem] text-ink-faint">CM1–CM5 · {view.company.name}</span>
        </div>
        <p className="mt-0.5 text-[0.8rem] text-ink-soft">
          Every tier strips another cost from net sales to reveal true contribution.
        </p>

        <div className="mt-4">
          {wf.rows.map((r) => (
            <WfLine key={r.key} row={r} netSales={wf.netSales} full={full} marginColor={marginColor} />
          ))}
        </div>
      </Card>

      {/* where each dollar goes */}
      <DollarSplit wf={wf} full={full} />

      {/* later-phase intelligence */}
      <Card className="p-5">
        <div className="flex items-center gap-2">
          <Icon name="sparkle" className="h-4.5 w-4.5 text-gold-600" />
          <h3 className="font-display text-[1.02rem] font-bold">Later-phase intelligence</h3>
        </div>
        <p className="mt-0.5 text-[0.8rem] text-ink-soft">
          Deeper analytics planned for future phases, layered on the same True Profit engine.
        </p>
        <ul className="mt-3 grid gap-2 sm:grid-cols-2">
          {laterPhase.map((item) => (
            <li key={item} className="flex items-center justify-between gap-2 rounded-xl border border-line bg-paper-sunken px-3.5 py-2.5 text-[0.83rem]">
              <span className="font-medium">{item}</span>
              <Pill tone="neutral">Planned</Pill>
            </li>
          ))}
        </ul>
      </Card>
    </>
  );
}

function WfLine({
  row: r,
  netSales,
  full,
  marginColor,
}: {
  row: WfRow;
  netSales: number;
  full: boolean;
  marginColor: (v: number) => string;
}) {
  const masked = r.restricted && !full;

  if (r.kind === "deduction") {
    return (
      <div className="flex items-baseline justify-between py-1.5 pl-4 text-[0.82rem] text-ink-soft">
        <span>− {r.label}</span>
        <span className="tnum">
          {masked ? (
            <span className="inline-flex items-center gap-1 text-ink-faint"><Icon name="lock" className="h-3.5 w-3.5" /> Restricted</span>
          ) : (
            `(${fmtUSD(r.amount)})`
          )}
        </span>
      </div>
    );
  }

  const width = netSales ? Math.max(0, (r.amount / netSales) * 100) : 0;
  const isBase = r.kind === "base";
  const barTone = isBase ? "bg-jade-700" : r.amount >= 0 ? "bg-linear-to-r from-jade-400 to-jade-600" : "bg-critical";

  return (
    <div className={`py-2 ${r.level ? "border-t border-line-soft" : ""}`}>
      <div className="mb-1.5 flex items-baseline justify-between gap-3">
        <span className={`text-[0.86rem] ${isBase || r.level === 5 ? "font-bold" : "font-semibold"}`}>{r.label}</span>
        <span className="flex items-baseline gap-2.5">
          {r.pct != null && !masked && (
            <span className={`tnum text-[0.74rem] font-semibold ${isBase ? "text-ink-faint" : marginColor(r.amount)}`}>
              {r.pct.toFixed(1)}%
            </span>
          )}
          <span className={`tnum w-24 text-right text-[0.9rem] font-bold ${masked ? "text-ink-faint" : r.amount < 0 ? "text-critical" : ""}`}>
            {masked ? <Icon name="lock" className="ml-auto h-4 w-4" /> : fmtUSD(r.amount)}
          </span>
        </span>
      </div>
      {!masked && (
        <div className="h-2 overflow-hidden rounded-full bg-paper-sunken">
          <div className={`h-full rounded-full ${barTone}`} style={{ width: `${Math.min(width, 100)}%` }} />
        </div>
      )}
    </div>
  );
}

function DollarSplit({ wf, full }: { wf: ReturnType<typeof profitWaterfall>; full: boolean }) {
  const costs = wf.rows.filter((r) => r.kind === "deduction");
  const profit = Math.max(0, wf.cm5);
  const denom = Math.max(wf.netSales, costs.reduce((s, c) => s + c.amount, 0) + profit);
  const colors: Record<string, string> = {
    cogs: "#8A9A8E",
    fulfil: "#B4894F",
    fees: "#A67C3D",
    mkt: "#3C6EA0",
    oh: "#54655A",
  };

  return (
    <Card className="p-5">
      <h3 className="font-display text-[1.02rem] font-bold">Where each net-sales dollar goes</h3>
      <div className="mt-4 flex h-4 overflow-hidden rounded-full bg-paper-sunken">
        {costs.map((c) => {
          const masked = c.restricted && !full;
          return (
            <div
              key={c.key}
              className={`h-full ${masked ? "opacity-40" : ""}`}
              style={{ width: `${(c.amount / denom) * 100}%`, backgroundColor: masked ? "var(--ink-faint)" : colors[c.key] }}
              title={c.label}
            />
          );
        })}
        {wf.cm5 >= 0 && <div className="h-full bg-good" style={{ width: `${(profit / denom) * 100}%` }} title="CM5 true profit" />}
      </div>
      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-[0.76rem]">
        {costs.map((c) => (
          <span key={c.key} className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: c.restricted && !full ? "var(--ink-faint)" : colors[c.key] }} />
            {c.label}
          </span>
        ))}
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-good" />
          {wf.cm5 >= 0 ? "CM5 true profit" : "Net loss"}
        </span>
      </div>
    </Card>
  );
}

function RestrictedTile() {
  return (
    <div className="relative flex flex-col justify-center overflow-hidden rounded-2xl border border-dashed border-line bg-paper-sunken/40 p-4.5">
      <span className="absolute inset-x-0 top-0 h-0.75 bg-line" />
      <p className="mb-2 text-[0.72rem] font-semibold uppercase tracking-wider text-ink-faint">CM5 · true profit</p>
      <p className="flex items-center gap-2 font-display text-[1.1rem] font-bold text-ink-faint">
        <Icon name="lock" className="h-4.5 w-4.5" /> Restricted
      </p>
      <p className="mt-1.5 text-[0.76rem] text-ink-soft">Requires Manager or Owner access</p>
    </div>
  );
}
