import { Card } from "../../components/ui/Card";
import { StatCard } from "../../components/ui/StatCard";
import { Pill } from "../../components/ui/Pill";
import { Button } from "../../components/ui/Button";
import { Icon } from "../../components/ui/Icon";
import {
  adminJourney,
  connStateMeta,
  connectorSummary,
  connectorsFor,
  dataIssues,
  intCompanies,
  kindLabel,
  marketingPlatforms,
  shopifyAreas,
  type Connector,
} from "./data";

function ConnectorCard({ c }: { c: Connector }) {
  const m = connStateMeta[c.state];
  const needsFix = c.state === "reconnect" || c.state === "partial";
  return (
    <Card className="flex flex-col gap-3 p-4.5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <span
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-[0.6rem] font-bold tracking-wide text-white"
            style={{ backgroundColor: c.brand }}
          >
            {c.abbrev}
          </span>
          <div className="min-w-0">
            <p className="truncate text-[0.92rem] font-bold leading-tight">{c.platform}</p>
            <p className="truncate text-[0.76rem] text-ink-soft">{c.scope}</p>
          </div>
        </div>
        <Pill tone={m.tone}>{m.label}</Pill>
      </div>

      <p className="text-[0.78rem] text-ink-soft">{c.detail}</p>

      <div className="mt-auto flex items-center justify-between border-t border-line-soft pt-3 text-[0.72rem] text-ink-faint">
        <span className="inline-flex items-center gap-1.5">
          <Icon name="calendar" className="h-3.5 w-3.5" />
          {c.schedule} · {kindLabel[c.kind]}
        </span>
        {needsFix ? (
          <Button variant={c.state === "reconnect" ? "primary" : "ghost"} size="sm" icon="integrations">
            {c.state === "reconnect" ? "Reconnect" : "Fix mapping"}
          </Button>
        ) : (
          <span className="tnum">Synced {c.lastRefresh}</span>
        )}
      </div>
    </Card>
  );
}

export function IntegrationCenterSection({ companyId }: { companyId: string | null }) {
  const list = connectorsFor(companyId);
  const summary = connectorSummary(list);
  const issues = companyId ? dataIssues.filter((i) => i.companyId === companyId) : dataIssues;
  const companyName = intCompanies.find((c) => c.id === companyId)?.name;

  return (
    <>
      {/* health summary */}
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Connected sources" value={`${summary.connected}`} caption={`of ${summary.total} configured`} />
        <StatCard
          label="Needs attention"
          value={`${summary.attention}`}
          delta={summary.attention ? { direction: "down", text: "reconnect or mapping" } : undefined}
          caption={summary.attention ? undefined : "All sources healthy"}
        />
        <StatCard label="Open data-quality issues" value={`${issues.filter((i) => i.action !== "N/A").length}`} caption="Flagged, not guessed" />
      </div>

      {/* connectors */}
      <Card>
        <div className="flex items-baseline justify-between border-b border-line-soft px-5 py-4">
          <h3 className="font-display text-[1.02rem] font-bold">Connected sources</h3>
          <span className="text-[0.76rem] text-ink-faint">
            {companyName ? `${companyName} + portfolio-wide` : "Integration-first · manual entry is the exception"}
          </span>
        </div>
        <div className="grid gap-4 p-5 sm:grid-cols-2 xl:grid-cols-3">
          {list.map((c) => (
            <ConnectorCard key={c.id} c={c} />
          ))}
        </div>
      </Card>

      {/* data-quality issues */}
      <Card>
        <div className="flex items-baseline justify-between border-b border-line-soft px-5 py-4">
          <h3 className="font-display text-[1.02rem] font-bold">Data-quality issues</h3>
          <span className="text-[0.76rem] text-ink-faint">{issues.length} open</span>
        </div>
        <div className="thin-scroll overflow-x-auto">
          <table className="w-full text-[0.85rem]">
            <thead>
              <tr className="border-b border-line text-left">
                {["Company", "Issue", "Source", "Impact", ""].map((h, i) => (
                  <th
                    key={h || "act"}
                    className={`whitespace-nowrap px-4 py-2.5 text-[0.7rem] font-bold uppercase tracking-wider text-ink-faint ${i === 4 ? "text-right" : ""}`}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {issues.map((iss) => {
                const co = intCompanies.find((c) => c.id === iss.companyId);
                return (
                  <tr key={iss.id} className="border-b border-line-soft last:border-0 hover:bg-paper-sunken">
                    <td className="px-4 py-3">
                      <span className="flex items-center gap-2.5 font-semibold">
                        <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: co?.color ?? "#999" }} />
                        {co?.name ?? iss.companyId}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-ink-soft">{iss.issue}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-ink-soft">{iss.source}</td>
                    <td className="px-4 py-3">
                      <Pill tone={iss.tone}>{iss.impact}</Pill>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button variant="ghost" size="sm" disabled={iss.action === "N/A"}>
                        {iss.action}
                      </Button>
                    </td>
                  </tr>
                );
              })}
              {issues.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-[0.85rem] text-ink-faint">
                    No open issues for {companyName}.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* what each source feeds */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="p-5">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg text-[0.55rem] font-bold text-white" style={{ backgroundColor: "#95BF47" }}>
              SHP
            </span>
            <h3 className="font-display text-[1.02rem] font-bold">Shopify data areas</h3>
          </div>
          <p className="mt-1 text-[0.78rem] text-ink-soft">
            All data available through approved Shopify APIs, permissions and plan capabilities.
          </p>
          <ul className="mt-3 flex flex-col divide-y divide-line-soft">
            {shopifyAreas.map((a) => (
              <li key={a.area} className="py-2.5">
                <p className="text-[0.84rem] font-semibold">{a.area}</p>
                <p className="text-[0.78rem] text-ink-soft">{a.use}</p>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="p-5">
          <div className="flex items-center gap-2">
            <Icon name="ecommerce" className="h-5 w-5 text-jade-600" />
            <h3 className="font-display text-[1.02rem] font-bold">Marketing platforms</h3>
          </div>
          <p className="mt-1 text-[0.78rem] text-ink-soft">
            Advertising and organic social stay separate — different purposes, different permissions.
          </p>
          <ul className="mt-3 flex flex-col divide-y divide-line-soft">
            {marketingPlatforms.map((p) => (
              <li key={p.platform} className="py-2.5">
                <p className="text-[0.84rem] font-semibold">{p.platform}</p>
                <p className="text-[0.78rem] text-ink-soft">{p.data}</p>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {/* admin journey (12C.7) */}
      <Card className="p-5">
        <h3 className="font-display text-[1.02rem] font-bold">Admin journey — connect &amp; analyse</h3>
        <ol className="mt-3 grid gap-x-6 gap-y-3 sm:grid-cols-2">
          {adminJourney.map((step, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-jade-100 text-[0.72rem] font-bold text-jade-700">
                {i + 1}
              </span>
              <span className="text-[0.82rem] text-ink-soft">{step}</span>
            </li>
          ))}
        </ol>
      </Card>
    </>
  );
}
