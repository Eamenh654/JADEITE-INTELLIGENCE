import { useState } from "react";
import { Card } from "../../components/ui/Card";
import { Icon } from "../../components/ui/Icon";
import { areaLabel, auditAreas, auditLog, type AuditArea } from "./data";

export default function AuditHistory() {
  const [area, setArea] = useState<AuditArea | null>(null);

  const visible = area ? auditLog.filter((e) => e.area === area) : auditLog;

  return (
    <div className="flex flex-col gap-6">
      {/* head */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-display text-[0.82rem] font-medium italic text-gold-600">Administration</p>
          <h2 className="mt-0.5 font-display text-[1.6rem] font-bold">Audit history</h2>
          <p className="mt-0.5 text-[0.85rem] text-ink-soft">
            A complete record of who changed what — the previous value, the new value, when, why and any related approval.
          </p>
        </div>
      </div>

      {/* coverage cards / area filter */}
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {auditAreas.map((a) => {
          const active = area === a.id;
          return (
            <button
              key={a.id}
              onClick={() => setArea(active ? null : a.id)}
              className={`rounded-2xl border bg-paper-raised p-4 text-left shadow-(--shadow-sm) transition-colors ${
                active ? "border-jade-500 ring-1 ring-jade-500/40" : "border-line hover:bg-paper-sunken"
              }`}
            >
              <p className="text-[0.86rem] font-bold">{a.label}</p>
              <p className="mt-1 text-[0.74rem] leading-snug text-ink-soft">{a.examples}</p>
            </button>
          );
        })}
      </div>

      {/* log */}
      <Card>
        <div className="flex items-center justify-between border-b border-line-soft px-5 py-4">
          <h3 className="font-display text-[1.02rem] font-bold">
            {area ? `${areaLabel[area]} activity` : "All activity"}
          </h3>
          <div className="flex items-center gap-3">
            {area && (
              <button
                onClick={() => setArea(null)}
                className="inline-flex items-center gap-1 text-[0.76rem] font-semibold text-jade-600 hover:underline"
              >
                <Icon name="close" className="h-3.5 w-3.5" /> Clear
              </button>
            )}
            <span className="text-[0.76rem] text-ink-faint">{visible.length} events</span>
          </div>
        </div>
        <div className="thin-scroll overflow-x-auto">
          <table className="w-full text-[0.85rem]">
            <thead>
              <tr className="border-b border-line text-left">
                {["When", "Who", "Action", "Item", "Change", "Reason"].map((h) => (
                  <th key={h} className="whitespace-nowrap px-4 py-2.5 text-[0.7rem] font-bold uppercase tracking-wider text-ink-faint">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visible.map((e) => (
                <tr key={e.id} className="border-b border-line-soft last:border-0 hover:bg-paper-sunken">
                  <td className="tnum whitespace-nowrap px-4 py-3 text-ink-soft">{e.when}</td>
                  <td className="whitespace-nowrap px-4 py-3 font-semibold">{e.who}</td>
                  <td className="whitespace-nowrap px-4 py-3">{e.action}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col gap-1">
                      <span className="text-ink-soft">{e.item}</span>
                      <span className="w-fit rounded-md bg-paper-sunken px-1.5 py-0.5 text-[0.66rem] font-semibold uppercase tracking-wide text-ink-faint">
                        {areaLabel[e.area]}
                      </span>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    {e.from != null && e.to != null ? (
                      <span className="inline-flex items-center gap-1.5 tnum">
                        <span className="text-ink-faint line-through">{e.from}</span>
                        <Icon name="chevron-right" className="h-3 w-3 text-ink-faint" />
                        <span className="font-semibold text-jade-700">{e.to}</span>
                      </span>
                    ) : (
                      <span className="text-ink-faint">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-ink-soft">{e.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
