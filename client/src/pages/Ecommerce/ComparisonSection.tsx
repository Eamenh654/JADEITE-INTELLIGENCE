import { Card } from "../../components/ui/Card";
import { StatCard } from "../../components/ui/StatCard";
import { Pill } from "../../components/ui/Pill";
import { ScopeTag } from "../Employees/parts";
import { MONTHS_ELAPSED, campaignTotals, ecomCompanies, fmtUSD, getEcom } from "./data";

export function ComparisonSection() {
  const rows = ecomCompanies
    .map((c) => {
      const view = getEcom(c.id)!;
      const camp = campaignTotals(c.id);
      return { c, s: view.summary, camp };
    })
    .sort((a, b) => b.s.revenue - a.s.revenue);

  const totalRev = rows.reduce((s, r) => s + r.s.revenue, 0);
  const totalSpend = rows.reduce((s, r) => s + r.camp.spend, 0);
  const totalCampRev = rows.reduce((s, r) => s + r.camp.revenue, 0);
  const totalOrders = rows.reduce((s, r) => s + r.s.orders, 0);
  const blendedRoas = totalSpend ? totalCampRev / totalSpend : 0;
  const expected = (MONTHS_ELAPSED / 12) * 100;
  const maxRev = Math.max(...rows.map((r) => r.s.revenue));

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Consolidated online revenue" value={fmtUSD(totalRev)} caption={`${rows.length} brands · H1`} />
        <StatCard label="Combined orders" value={totalOrders.toLocaleString()} caption="Across the portfolio" />
        <StatCard label="Combined ad spend" value={fmtUSD(totalSpend)} caption="All channels" />
        <StatCard label="Blended ROAS" value={`${blendedRoas.toFixed(2)}x`} caption="Portfolio-wide" />
      </div>

      {/* revenue comparison bars */}
      <Card className="p-5">
        <h3 className="font-display text-[1.02rem] font-bold">Online revenue by brand</h3>
        <p className="mt-0.5 text-[0.8rem] text-ink-soft">H1 2026 online revenue, largest first.</p>
        <div className="mt-4 flex flex-col gap-3.5">
          {rows.map(({ c, s }) => (
            <div key={c.id}>
              <div className="mb-1 flex items-center justify-between text-[0.82rem]">
                <ScopeTag code={c.code} />
                <span className="tnum font-semibold">
                  {fmtUSD(s.revenue)} <span className="text-ink-faint">· {((s.revenue / totalRev) * 100).toFixed(0)}%</span>
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-paper-sunken">
                <div className="h-full rounded-full" style={{ width: `${(s.revenue / maxRev) * 100}%`, backgroundColor: c.color }} />
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* comparison table */}
      <Card>
        <div className="border-b border-line-soft px-5 py-4">
          <h3 className="font-display text-[1.02rem] font-bold">Brand comparison</h3>
        </div>
        <div className="thin-scroll overflow-x-auto">
          <table className="w-full text-[0.85rem]">
            <thead>
              <tr className="border-b border-line text-left">
                {["Brand", "Online rev", "% of annual", "AOV", "Conv.", "ROAS", "Ad spend"].map((h, i) => (
                  <th key={h} className={`whitespace-nowrap px-4 py-2.5 text-[0.7rem] font-bold uppercase tracking-wider text-ink-faint ${i > 0 ? "text-right" : ""}`}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map(({ c, s, camp }) => {
                const behind = s.attainmentAnnual < expected;
                return (
                  <tr key={c.id} className="border-b border-line-soft last:border-0">
                    <td className="px-4 py-3"><ScopeTag code={c.code} /></td>
                    <td className="tnum px-4 py-3 text-right font-semibold">{fmtUSD(s.revenue)}</td>
                    <td className="px-4 py-3 text-right">
                      <span className="inline-flex items-center justify-end gap-1.5">
                        <span className={`tnum font-semibold ${behind ? "text-critical" : "text-good"}`}>{s.attainmentAnnual.toFixed(0)}%</span>
                      </span>
                    </td>
                    <td className="tnum px-4 py-3 text-right text-ink-soft">${s.aov.toFixed(0)}</td>
                    <td className="tnum px-4 py-3 text-right text-ink-soft">{s.conversion.toFixed(2)}%</td>
                    <td className={`tnum px-4 py-3 text-right font-semibold ${camp.roas >= 3 ? "text-good" : camp.roas >= 2 ? "text-warn" : "text-critical"}`}>
                      {camp.roas.toFixed(2)}x
                    </td>
                    <td className="tnum px-4 py-3 text-right text-ink-soft">{fmtUSD(camp.spend)}</td>
                  </tr>
                );
              })}
              <tr className="bg-paper-sunken/50 font-bold">
                <td className="px-4 py-3">Consolidated</td>
                <td className="tnum px-4 py-3 text-right">{fmtUSD(totalRev)}</td>
                <td className="px-4 py-3 text-right text-ink-faint">—</td>
                <td className="px-4 py-3 text-right text-ink-faint">—</td>
                <td className="px-4 py-3 text-right text-ink-faint">—</td>
                <td className="tnum px-4 py-3 text-right text-jade-600">{blendedRoas.toFixed(2)}x</td>
                <td className="tnum px-4 py-3 text-right">{fmtUSD(totalSpend)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>

      <p className="flex items-center gap-2 text-[0.78rem] text-ink-faint">
        <Pill tone="good">Ahead</Pill> and <Pill tone="critical">behind</Pill> are measured against the {expected.toFixed(0)}% pace expected by June.
      </p>
    </>
  );
}
