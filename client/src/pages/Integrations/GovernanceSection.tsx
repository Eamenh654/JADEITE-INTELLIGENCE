import { Card } from "../../components/ui/Card";
import { Icon } from "../../components/ui/Icon";
import { governanceRules, metricDefs, sourceOfTruth } from "./data";

export function GovernanceSection() {
  return (
    <>
      {/* one approved definition per metric */}
      <Card>
        <div className="flex items-baseline justify-between border-b border-line-soft px-5 py-4">
          <h3 className="font-display text-[1.02rem] font-bold">Metric definitions</h3>
          <span className="text-[0.76rem] text-ink-faint">One approved definition each</span>
        </div>
        <div className="thin-scroll overflow-x-auto">
          <table className="w-full text-[0.85rem]">
            <thead>
              <tr className="border-b border-line text-left">
                {["Metric", "Approved definition", "Source of truth"].map((h) => (
                  <th key={h} className="whitespace-nowrap px-4 py-2.5 text-[0.7rem] font-bold uppercase tracking-wider text-ink-faint">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {metricDefs.map((m) => (
                <tr key={m.metric} className="border-b border-line-soft last:border-0 hover:bg-paper-sunken">
                  <td className="whitespace-nowrap px-4 py-3 font-semibold">{m.metric}</td>
                  <td className="px-4 py-3 text-ink-soft">{m.definition}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-ink-soft">{m.source}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* source of truth by data area */}
      <Card>
        <div className="flex items-baseline justify-between border-b border-line-soft px-5 py-4">
          <h3 className="font-display text-[1.02rem] font-bold">Source of truth by data area</h3>
          <span className="text-[0.76rem] text-ink-faint">System of record</span>
        </div>
        <div className="grid gap-px bg-line-soft sm:grid-cols-2 lg:grid-cols-3">
          {sourceOfTruth.map((s) => (
            <div key={s.area} className="bg-paper-raised p-5">
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.06em] text-ink-faint">{s.area}</p>
              <p className="mt-1 font-display text-[1.02rem] font-bold">{s.system}</p>
              <p className="mt-1 text-[0.78rem] text-ink-soft">{s.note}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* governance principles */}
      <Card className="p-5">
        <div className="flex items-center gap-2">
          <Icon name="shield-check" className="h-4.5 w-4.5 text-jade-600" />
          <h3 className="font-display text-[1.02rem] font-bold">Governance requirements</h3>
        </div>
        <ul className="mt-3 flex flex-col gap-2.5">
          {governanceRules.map((rule) => (
            <li key={rule} className="flex items-start gap-2.5 text-[0.83rem] text-ink-soft">
              <Icon name="check" className="mt-0.5 h-4 w-4 shrink-0 text-jade-600" strokeWidth={2.2} />
              {rule}
            </li>
          ))}
        </ul>
      </Card>
    </>
  );
}
