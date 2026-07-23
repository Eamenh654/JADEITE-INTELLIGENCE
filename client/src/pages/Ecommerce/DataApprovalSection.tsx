import { useState } from "react";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Pill } from "../../components/ui/Pill";
import { Icon } from "../../components/ui/Icon";
import {
  MONTHS,
  approvalStages,
  dataSources,
  fmtUSD,
  seedMonthStatuses,
  statusMeta,
  type EcomView,
  type MonthStatus,
} from "./data";

const nextStatus: Record<MonthStatus, MonthStatus | null> = {
  draft: "submitted",
  submitted: "approved",
  approved: "locked",
  locked: null,
};

const advanceLabel: Record<MonthStatus, string> = {
  draft: "Submit for review",
  submitted: "Approve figures",
  approved: "Lock month",
  locked: "Locked",
};

const sourceMeta: Record<string, { tone: "good" | "critical" | "neutral"; label: string; icon: "check" | "close" | "upload" }> = {
  synced: { tone: "good", label: "Synced", icon: "check" },
  expired: { tone: "critical", label: "Expired", icon: "close" },
  manual: { tone: "neutral", label: "Manual", icon: "upload" },
};

export function DataApprovalSection({ view }: { view: EcomView }) {
  const { company: c, months } = view;
  const [statuses, setStatuses] = useState<Record<string, MonthStatus>>(seedMonthStatuses());
  const sources = dataSources(c.id);

  const currentMonth = MONTHS.find((m) => statuses[m] !== "locked") ?? null;
  const currentStatus = currentMonth ? statuses[currentMonth] : "locked";
  const currentIdx = approvalStages.findIndex((s) => s.id === currentStatus);

  const advance = () => {
    if (!currentMonth) return;
    const nx = nextStatus[statuses[currentMonth]];
    if (nx) setStatuses((s) => ({ ...s, [currentMonth]: nx }));
  };

  return (
    <>
      {/* data sources */}
      <Card>
        <div className="flex items-baseline justify-between border-b border-line-soft px-5 py-4">
          <h3 className="font-display text-[1.02rem] font-bold">Data sources</h3>
          <span className="text-[0.76rem] text-ink-faint">Integrations + manual entry</span>
        </div>
        <ul className="flex flex-col">
          {sources.map((src) => {
            const m = sourceMeta[src.state];
            return (
              <li key={src.name} className="flex items-center gap-3 border-b border-line-soft px-5 py-3.5 last:border-0">
                <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${src.state === "expired" ? "bg-critical-bg text-critical" : src.state === "manual" ? "bg-paper-sunken text-ink-soft" : "bg-jade-100 text-jade-600"}`}>
                  <Icon name={src.state === "manual" ? "upload" : "integrations"} className="h-4.25 w-4.25" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[0.86rem] font-semibold">{src.name}</p>
                  <p className="truncate text-[0.76rem] text-ink-soft">{src.feeds}</p>
                </div>
                <div className="hidden text-right sm:block">
                  <Pill tone={m.tone}>{m.label}</Pill>
                  <p className="mt-1 text-[0.72rem] text-ink-faint">{src.meta}</p>
                </div>
                {src.state === "expired" && (
                  <Button variant="primary" size="sm" icon="integrations">Reconnect</Button>
                )}
              </li>
            );
          })}
        </ul>
      </Card>

      {/* monthly close */}
      <Card className="p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[0.72rem] font-semibold uppercase tracking-wider text-ink-faint">Monthly close</p>
            <h3 className="font-display text-[1.15rem] font-bold">
              {currentMonth ? `${currentMonth} 2026` : "All months locked"}
            </h3>
          </div>
          {currentMonth ? (
            <div className="flex items-center gap-2.5">
              <Pill tone={statusMeta[currentStatus].tone}>{statusMeta[currentStatus].label}</Pill>
              <Button variant="primary" size="sm" icon={currentStatus === "approved" ? "lock" : "chevron-right"} onClick={advance}>
                {advanceLabel[currentStatus]}
              </Button>
            </div>
          ) : (
            <Pill tone="good">Complete</Pill>
          )}
        </div>

        {/* stepper */}
        <div className="thin-scroll mt-4 flex gap-1 overflow-x-auto pb-1">
          {approvalStages.map((s, i) => {
            const done = currentMonth ? i < currentIdx : true;
            const active = currentMonth ? i === currentIdx : false;
            return (
              <div key={s.id} className="flex min-w-24 flex-1 flex-col items-center text-center">
                <div className="flex w-full items-center">
                  <span className={`h-0.5 flex-1 ${i === 0 ? "opacity-0" : done || active ? "bg-jade-500" : "bg-line"}`} />
                  <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[0.72rem] font-bold ${done ? "bg-jade-600 text-white" : active ? "bg-jade-600 text-white ring-4 ring-jade-100" : "border border-line bg-paper-raised text-ink-faint"}`}>
                    {done ? <Icon name="check" className="h-3.5 w-3.5" strokeWidth={2.4} /> : i + 1}
                  </span>
                  <span className={`h-0.5 flex-1 ${i === approvalStages.length - 1 ? "opacity-0" : done ? "bg-jade-500" : "bg-line"}`} />
                </div>
                <span className={`mt-1.5 text-[0.68rem] font-semibold leading-tight ${active ? "text-jade-700" : "text-ink-soft"}`}>{s.label}</span>
                <span className="mt-0.5 hidden text-[0.64rem] text-ink-faint sm:block">{s.hint}</span>
              </div>
            );
          })}
        </div>

        <p className="mt-4 flex items-start gap-2 rounded-lg bg-paper-sunken px-3.5 py-2.5 text-[0.76rem] text-ink-soft">
          <Icon name="shield-check" className="mt-0.5 h-4 w-4 shrink-0 text-jade-600" />
          Locking a month freezes both synced and manually-entered figures and feeds them to
          consolidated reporting. AI can pre-fill and flag anomalies, but only a person can lock.
        </p>
      </Card>

      {/* month ledger */}
      <Card>
        <div className="thin-scroll overflow-x-auto">
          <table className="w-full text-[0.85rem]">
            <thead>
              <tr className="border-b border-line text-left">
                {["Month", "Online revenue", "Orders", "Status"].map((h, i) => (
                  <th key={h} className={`whitespace-nowrap px-4 py-2.5 text-[0.7rem] font-bold uppercase tracking-wider text-ink-faint ${i > 0 ? "text-right" : ""}`}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {months.map((m) => {
                const st = statusMeta[statuses[m.month] ?? "locked"];
                return (
                  <tr key={m.month} className="border-b border-line-soft last:border-0">
                    <td className="px-4 py-3 font-semibold">{m.month} 2026</td>
                    <td className="tnum px-4 py-3 text-right">{fmtUSD(m.revenue)}</td>
                    <td className="tnum px-4 py-3 text-right text-ink-soft">{m.orders.toLocaleString()}</td>
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
    </>
  );
}
