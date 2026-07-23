import { useState } from "react";
import { Button } from "../../components/ui/Button";
import { Icon } from "../../components/ui/Icon";
import { scopeByCode } from "../Employees/data";
import { initialAlerts, type EcomAlert } from "./data";

const toneStyle: Record<EcomAlert["tone"], { chip: string; icon: "close" | "flag" | "bell"; label: string }> = {
  critical: { chip: "bg-critical-bg text-critical", icon: "close", label: "Critical" },
  warn: { chip: "bg-warn-bg text-warn", icon: "flag", label: "Warning" },
  info: { chip: "bg-info-bg text-info", icon: "bell", label: "Info" },
};

export function AlertsSection() {
  const [alerts, setAlerts] = useState<EcomAlert[]>(initialAlerts);
  const resolve = (id: string) => setAlerts((a) => a.filter((x) => x.id !== id));

  const counts = {
    critical: alerts.filter((a) => a.tone === "critical").length,
    warn: alerts.filter((a) => a.tone === "warn").length,
    info: alerts.filter((a) => a.tone === "info").length,
  };

  return (
    <>
      <div className="flex flex-wrap gap-2">
        {(["critical", "warn", "info"] as const).map((t) => (
          <span key={t} className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[0.78rem] font-bold ${toneStyle[t].chip}`}>
            <Icon name={toneStyle[t].icon} className="h-3.5 w-3.5" />
            {counts[t]} {toneStyle[t].label.toLowerCase()}
          </span>
        ))}
      </div>

      {alerts.length === 0 ? (
        <div className="flex min-h-[30vh] flex-col items-center justify-center rounded-2xl border border-dashed border-line bg-paper-raised/50 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-jade-100 text-jade-600">
            <Icon name="check" className="h-6 w-6" strokeWidth={2.2} />
          </span>
          <p className="mt-4 font-display text-[1.1rem] font-bold">All clear</p>
          <p className="mt-1 max-w-sm text-[0.83rem] text-ink-soft">No open e-commerce alerts across the portfolio.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {alerts.map((a) => {
            const s = toneStyle[a.tone];
            const company = scopeByCode[a.code];
            return (
              <div key={a.id} className="flex items-start gap-3.5 rounded-2xl border border-line bg-paper-raised p-4 shadow-(--shadow-sm)">
                <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${s.chip}`}>
                  <Icon name={s.icon} className="h-4.5 w-4.5" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-[0.9rem] font-bold">{a.title}</p>
                    {company && (
                      <span className="inline-flex items-center gap-1.5 rounded-md bg-paper-sunken px-1.5 py-0.5 text-[0.68rem] font-semibold text-ink-soft">
                        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: company.color }} />
                        {company.name}
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-[0.82rem] text-ink-soft">{a.detail}</p>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-2">
                  <Button variant="ghost" size="sm" icon="chevron-right">{a.action}</Button>
                  <button
                    onClick={() => resolve(a.id)}
                    className="flex items-center gap-1 text-[0.74rem] font-semibold text-ink-faint hover:text-ink"
                  >
                    <Icon name="check" className="h-3.5 w-3.5" /> Resolve
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
