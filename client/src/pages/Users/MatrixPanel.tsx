import { useState } from "react";
import { Card } from "../../components/ui/Card";
import { Icon } from "../../components/ui/Icon";
import { defaultMatrix, moduleOptions, permModules, permRoles, type PermRole } from "./data";

const cellClass =
  "w-full rounded-md border border-line bg-paper-sunken px-2 py-1.5 text-[0.76rem] text-ink focus:border-jade-500 focus:outline-none";

export function MatrixPanel() {
  // Deep copy so edits don't mutate the shared defaults.
  const [matrix, setMatrix] = useState<Record<PermRole, string[]>>(() =>
    Object.fromEntries(permRoles.map((r) => [r, [...defaultMatrix[r]]])) as Record<PermRole, string[]>,
  );

  const change = (role: PermRole, idx: number, value: string) =>
    setMatrix((prev) => ({ ...prev, [role]: prev[role].map((v, i) => (i === idx ? value : v)) }));

  return (
    <Card>
      <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-line-soft px-5 py-4">
        <div className="flex items-baseline gap-2.5">
          <h3 className="font-display text-[1.02rem] font-bold">Per-role default access</h3>
          <span className="text-[0.78rem] text-ink-soft">Inherited by users; overridable per person</span>
        </div>
      </div>

      <div className="thin-scroll overflow-x-auto">
        <table className="w-full border-collapse text-[0.8rem]">
          <thead>
            <tr className="border-b border-line text-left">
              <th className="sticky left-0 z-10 bg-paper-raised px-4 py-2.5 text-[0.7rem] font-bold uppercase tracking-wider text-ink-faint">
                Role
              </th>
              {permModules.map((m) => (
                <th key={m} className="min-w-40 px-3 py-2.5 text-[0.7rem] font-bold uppercase tracking-wider text-ink-faint">
                  {m}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {permRoles.map((role) => (
              <tr key={role} className="border-b border-line-soft last:border-0">
                <td className="sticky left-0 z-10 whitespace-nowrap bg-paper-raised px-4 py-2.5 font-semibold">
                  {role}
                </td>
                {permModules.map((_, idx) => (
                  <td key={idx} className="px-3 py-2.5">
                    <select
                      className={cellClass}
                      value={matrix[role][idx]}
                      aria-label={`${role} — ${permModules[idx]}`}
                      onChange={(e) => change(role, idx, e.target.value)}
                    >
                      {moduleOptions(idx).map((o) => (
                        <option key={o} value={o}>{o}</option>
                      ))}
                    </select>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="flex items-start gap-2 border-t border-line-soft px-5 py-3.5 text-[0.78rem] text-ink-soft">
        <Icon name="shield-check" className="mt-0.5 h-4 w-4 shrink-0 text-jade-600" />
        Salary, bonus amount, bank balance, supplier cost, profitability tiers, equity, personal documents and audit
        history can be masked separately. The system warns on conflicts and logs every change — use “View as user” to
        confirm exact access before activation.
      </p>
    </Card>
  );
}
