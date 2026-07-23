import { useState } from "react";
import { Card } from "../../components/ui/Card";
import { systemGeneral, systemKpiBonus, systemStageFreq, systemToggles } from "./data";

function SettingTable({ rows, cols }: { rows: { a: string; b: string }[]; cols: [string, string] }) {
  return (
    <table className="w-full text-[0.83rem]">
      <thead>
        <tr className="border-b border-line text-left">
          {cols.map((c) => (
            <th key={c} className="px-4 py-2.5 text-[0.68rem] font-bold uppercase tracking-wider text-ink-faint">
              {c}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r.a} className="border-b border-line-soft last:border-0">
            <td className="px-4 py-2.5 font-semibold">{r.a}</td>
            <td className="px-4 py-2.5 text-ink-soft">{r.b}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function Toggle({ on, onToggle, label }: { on: boolean; onToggle: () => void; label: string }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-line-soft py-3 last:border-0">
      <span className="text-[0.85rem]">{label}</span>
      <button
        role="switch"
        aria-checked={on}
        aria-label={label}
        onClick={onToggle}
        className={`relative h-5.5 w-9.5 shrink-0 rounded-full transition-colors ${on ? "bg-jade-600" : "bg-line"}`}
      >
        <span
          className={`absolute top-0.5 h-4.5 w-4.5 rounded-full bg-white shadow-(--shadow-sm) transition-[left] ${on ? "left-4.5" : "left-0.5"}`}
        />
      </button>
    </div>
  );
}

export function SystemPanel() {
  const [toggles, setToggles] = useState<Record<string, boolean>>(
    () => Object.fromEntries(systemToggles.map((t) => [t.id, true])),
  );

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card>
        <div className="border-b border-line-soft px-5 py-4">
          <h3 className="font-display text-[1.02rem] font-bold">Companies, stages &amp; departments</h3>
        </div>
        <SettingTable cols={["Setting", "Value"]} rows={systemGeneral.map((r) => ({ a: r.label, b: r.value }))} />
      </Card>

      <Card>
        <div className="border-b border-line-soft px-5 py-4">
          <h3 className="font-display text-[1.02rem] font-bold">KPI templates &amp; bonus rules</h3>
        </div>
        <SettingTable cols={["Setting", "Value"]} rows={systemKpiBonus.map((r) => ({ a: r.label, b: r.value }))} />
      </Card>

      <Card>
        <div className="border-b border-line-soft px-5 py-4">
          <h3 className="font-display text-[1.02rem] font-bold">Reporting periods &amp; status rules</h3>
        </div>
        <SettingTable cols={["Stage", "Financial frequency"]} rows={systemStageFreq.map((r) => ({ a: r.stage, b: r.frequency }))} />
      </Card>

      <Card className="p-5">
        <h3 className="font-display text-[1.02rem] font-bold">Task, document &amp; notification rules</h3>
        <div className="mt-2 flex flex-col">
          {systemToggles.map((t) => (
            <Toggle
              key={t.id}
              label={t.label}
              on={toggles[t.id]}
              onToggle={() => setToggles((prev) => ({ ...prev, [t.id]: !prev[t.id] }))}
            />
          ))}
        </div>
      </Card>
    </div>
  );
}
