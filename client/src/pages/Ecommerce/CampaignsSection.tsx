import { Card } from "../../components/ui/Card";
import { StatCard } from "../../components/ui/StatCard";
import { Pill } from "../../components/ui/Pill";
import {
  campaignTotals,
  channelColor,
  fmtUSD,
  getCampaigns,
  type CampaignStatus,
  type EcomView,
} from "./data";

const statusTone: Record<CampaignStatus, { tone: "good" | "warn" | "critical" | "neutral"; label: string }> = {
  active: { tone: "good", label: "Active" },
  paused: { tone: "warn", label: "Paused" },
  ended: { tone: "neutral", label: "Ended" },
  attention: { tone: "critical", label: "Needs attention" },
};

export function CampaignsSection({ view }: { view: EcomView }) {
  const campaigns = getCampaigns(view.company.id);
  const t = campaignTotals(view.company.id);
  const roasTarget = 3.0;

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Ad spend" value={fmtUSD(t.spend)} caption={`${campaigns.length} campaigns`} />
        <StatCard label="Attributed revenue" value={fmtUSD(t.revenue)} caption="Across channels" />
        <StatCard
          label="Blended ROAS"
          value={`${t.roas.toFixed(2)}x`}
          delta={{ direction: t.roas >= roasTarget ? "up" : "down", text: `${t.roas >= roasTarget ? "at/above" : "below"} ${roasTarget.toFixed(1)}x target` }}
        />
        <StatCard label="Blended CAC" value={`$${t.cac.toFixed(2)}`} caption="Per acquired order" />
      </div>

      <Card>
        <div className="flex items-baseline justify-between border-b border-line-soft px-5 py-4">
          <h3 className="font-display text-[1.02rem] font-bold">Campaign performance</h3>
          <span className="text-[0.76rem] text-ink-faint">{view.company.name}</span>
        </div>
        <div className="thin-scroll overflow-x-auto">
          <table className="w-full text-[0.85rem]">
            <thead>
              <tr className="border-b border-line text-left">
                {["Campaign", "Spend", "Revenue", "ROAS", "Orders", "CAC", "Status"].map((h, i) => (
                  <th key={h} className={`whitespace-nowrap px-4 py-2.5 text-[0.7rem] font-bold uppercase tracking-wider text-ink-faint ${i > 0 ? "text-right" : ""}`}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {campaigns.map((c) => {
                const roas = c.spend ? c.revenue / c.spend : 0;
                const cac = c.orders ? c.spend / c.orders : 0;
                const st = statusTone[c.status];
                return (
                  <tr key={c.id} className="border-b border-line-soft last:border-0 hover:bg-paper-sunken">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: channelColor[c.channel] }} />
                        <span className="font-semibold">{c.name}</span>
                      </div>
                    </td>
                    <td className="tnum px-4 py-3 text-right text-ink-soft">{fmtUSD(c.spend)}</td>
                    <td className="tnum px-4 py-3 text-right font-semibold">{fmtUSD(c.revenue)}</td>
                    <td className={`tnum px-4 py-3 text-right font-semibold ${roas >= roasTarget ? "text-good" : roas >= 2 ? "text-warn" : "text-critical"}`}>
                      {roas.toFixed(2)}x
                    </td>
                    <td className="tnum px-4 py-3 text-right text-ink-soft">{c.orders.toLocaleString()}</td>
                    <td className="tnum px-4 py-3 text-right text-ink-soft">${cac.toFixed(0)}</td>
                    <td className="px-4 py-3 text-right">
                      <span className="inline-flex justify-end">
                        <Pill tone={st.tone}>{st.label}</Pill>
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* channel mix */}
      <Card className="p-5">
        <h3 className="font-display text-[1.02rem] font-bold">Spend by channel</h3>
        <div className="mt-4 flex flex-col gap-3">
          {campaigns.map((c) => {
            const share = t.spend ? (c.spend / t.spend) * 100 : 0;
            return (
              <div key={c.id}>
                <div className="mb-1 flex items-center justify-between text-[0.82rem]">
                  <span className="font-medium">{c.name}</span>
                  <span className="tnum text-ink-soft">{fmtUSD(c.spend)} <span className="text-ink-faint">· {share.toFixed(0)}%</span></span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-paper-sunken">
                  <div className="h-full rounded-full" style={{ width: `${share}%`, backgroundColor: channelColor[c.channel] }} />
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </>
  );
}
