import { Card } from "../../components/ui/Card";
import { StatCard } from "../../components/ui/StatCard";
import { Pill } from "../../components/ui/Pill";
import {
  MONTHS_ELAPSED,
  PERIOD,
  fmtUSD,
  type EcomMonth,
  type EcomUpdate,
  type EcomView,
} from "./data";

export function DashboardSection({ view }: { view: EcomView }) {
  const { company: c, months, updates, summary: s } = view;
  return (
    <>
      <AnnualTarget actual={s.revenue} annualTarget={s.annualTarget} attainment={s.attainmentAnnual} />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Online revenue"
          value={fmtUSD(s.revenue)}
          delta={{ direction: s.deltaVsTarget >= 0 ? "up" : "down", text: `${s.deltaVsTarget >= 0 ? "+" : ""}${s.deltaVsTarget.toFixed(1)}% vs target` }}
        />
        <StatCard label="Orders" value={s.orders.toLocaleString()} caption={`${PERIOD} · H1`} />
        <StatCard label="Avg order value" value={`$${s.aov.toFixed(2)}`} caption="Per order" />
        <StatCard label="Conversion rate" value={`${s.conversion.toFixed(2)}%`} caption={`${s.sessions.toLocaleString()} sessions`} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.55fr_1fr] lg:items-start">
        <MonthlyTable months={months} />
        <WrittenUpdates updates={updates} accent={c.color} />
      </div>
    </>
  );
}

function AnnualTarget({ actual, annualTarget, attainment }: { actual: number; annualTarget: number; attainment: number }) {
  const expected = (MONTHS_ELAPSED / 12) * 100;
  const diff = attainment - expected;
  const pace =
    diff >= 0
      ? { tone: "good" as const, label: "Ahead of pace" }
      : diff >= -8
        ? { tone: "warn" as const, label: "Slightly behind" }
        : { tone: "critical" as const, label: "Behind pace" };

  return (
    <Card className="p-5 sm:p-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="lg:w-[38%]">
          <p className="text-[0.72rem] font-semibold uppercase tracking-wider text-ink-faint">Annual target vs actual</p>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="tnum font-display text-[2.4rem] font-bold leading-none">{attainment.toFixed(0)}%</span>
            <Pill tone={pace.tone}>{pace.label}</Pill>
          </div>
          <p className="mt-2 text-[0.86rem] text-ink-soft">
            <b className="text-ink">{fmtUSD(actual)}</b> of {fmtUSD(annualTarget)} annual target
          </p>
        </div>

        <div className="flex-1">
          <div className="relative h-3.5 rounded-full bg-paper-sunken">
            <div className="h-full rounded-full bg-linear-to-r from-jade-400 to-jade-600" style={{ width: `${Math.min(attainment, 100)}%` }} />
            <div className="absolute -top-1 -bottom-1 w-0.5 rounded bg-ink" style={{ left: `${expected}%` }} title={`Expected pace: ${expected.toFixed(0)}%`} />
          </div>
          <div className="mt-2 flex justify-between text-[0.72rem] text-ink-faint">
            <span>0</span>
            <span className="tnum">Pace to Jun · {expected.toFixed(0)}%</span>
            <span className="tnum">{fmtUSD(annualTarget)}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}

function MonthlyTable({ months }: { months: EcomMonth[] }) {
  return (
    <Card>
      <div className="flex items-baseline justify-between border-b border-line-soft px-5 py-4">
        <h3 className="font-display text-[1.02rem] font-bold">Monthly performance</h3>
        <span className="text-[0.76rem] text-ink-faint">{PERIOD}</span>
      </div>
      <div className="thin-scroll overflow-x-auto">
        <table className="w-full text-[0.85rem]">
          <thead>
            <tr className="border-b border-line text-left">
              {["Month", "Revenue", "Target", "vs Target", "Orders", "AOV", "Conv."].map((h, i) => (
                <th key={h} className={`whitespace-nowrap px-4 py-2.5 text-[0.7rem] font-bold uppercase tracking-wider text-ink-faint ${i > 0 ? "text-right" : ""}`}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {months.map((m) => {
              const vs = ((m.revenue - m.target) / m.target) * 100;
              const aov = m.revenue / m.orders;
              const conv = (m.orders / m.sessions) * 100;
              return (
                <tr key={m.month} className="border-b border-line-soft last:border-0">
                  <td className="px-4 py-3 font-semibold">{m.month}</td>
                  <td className="tnum px-4 py-3 text-right font-semibold">{fmtUSD(m.revenue)}</td>
                  <td className="tnum px-4 py-3 text-right text-ink-soft">{fmtUSD(m.target)}</td>
                  <td className={`tnum px-4 py-3 text-right font-semibold ${vs >= 0 ? "text-good" : "text-critical"}`}>
                    {vs >= 0 ? "+" : ""}
                    {vs.toFixed(1)}%
                  </td>
                  <td className="tnum px-4 py-3 text-right text-ink-soft">{m.orders.toLocaleString()}</td>
                  <td className="tnum px-4 py-3 text-right text-ink-soft">${aov.toFixed(0)}</td>
                  <td className="tnum px-4 py-3 text-right text-ink-soft">{conv.toFixed(2)}%</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

const initialsOf = (name: string) =>
  name.split(/\s+/).slice(0, 2).map((w) => w[0]?.toUpperCase() ?? "").join("");

function WrittenUpdates({ updates, accent }: { updates: EcomUpdate[]; accent: string }) {
  return (
    <Card>
      <div className="flex items-baseline justify-between border-b border-line-soft px-5 py-4">
        <h3 className="font-display text-[1.02rem] font-bold">Monthly updates</h3>
        <span className="text-[0.76rem] text-ink-faint">{updates.length} notes</span>
      </div>
      <ul className="flex flex-col">
        {updates.map((u, i) => (
          <li key={i} className="flex gap-3 border-b border-line-soft px-5 py-4 last:border-0">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[0.66rem] font-bold text-white" style={{ backgroundColor: accent }}>
              {initialsOf(u.author)}
            </span>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                <span className="text-[0.83rem] font-semibold">{u.author}</span>
                <span className="rounded-md bg-jade-100 px-1.5 py-0.5 text-[0.64rem] font-bold uppercase tracking-wider text-jade-600">{u.month}</span>
                <span className="text-[0.72rem] text-ink-faint">· {u.date}</span>
              </div>
              <p className="mt-1 text-[0.82rem] leading-relaxed text-ink-soft">{u.note}</p>
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}
