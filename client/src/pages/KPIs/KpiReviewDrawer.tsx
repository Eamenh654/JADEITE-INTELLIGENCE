import { useEffect } from "react";
import { Button } from "../../components/ui/Button";
import { Pill } from "../../components/ui/Pill";
import { Icon } from "../../components/ui/Icon";
import { Avatar, ScopeTag } from "../Employees/parts";
import type { Employee } from "../Employees/data";
import {
  attainment,
  fmtVal,
  reviewStages,
  statusFor,
  weightedScore,
  type Review,
} from "./data";

interface Props {
  review: Review;
  employee: Employee;
  onClose: () => void;
  onSetStage: (employeeId: string, stage: number) => void;
  onResolveAppeal: (employeeId: string, kpiId: string, outcome: string) => void;
}

function scoreColor(score: number | null): string {
  if (score == null) return "text-ink-faint";
  if (score >= 100) return "text-good";
  if (score >= 85) return "text-gold-600";
  return "text-critical";
}

export function KpiReviewDrawer({
  review,
  employee: e,
  onClose,
  onSetStage,
  onResolveAppeal,
}: Props) {
  useEffect(() => {
    const onKey = (ev: KeyboardEvent) => ev.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const score = weightedScore(review.kpis);
  const lastStage = reviewStages.length - 1;

  return (
    <div className="fixed inset-0 z-50 flex">
      <button aria-label="Close" onClick={onClose} className="flex-1 bg-jade-950/45 backdrop-blur-sm" />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label={`KPI review for ${e.name}`}
        className="ml-auto flex h-full w-full max-w-xl flex-col border-l border-line bg-paper-raised shadow-(--shadow-lg)"
      >
        {/* header */}
        <div className="flex items-start justify-between gap-3 border-b border-line-soft px-5 py-4">
          <div className="flex items-center gap-3">
            <Avatar person={e} size="lg" />
            <div className="min-w-0">
              <h2 className="font-display text-[1.2rem] font-bold leading-tight">{e.name}</h2>
              <p className="text-[0.83rem] text-ink-soft">{e.role}</p>
              <div className="mt-1.5 flex items-center gap-2">
                <ScopeTag code={e.companyCode} />
                <span className="text-[0.76rem] text-ink-faint">· {review.quarter}</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className={`font-display text-[1.6rem] font-bold leading-none tnum ${scoreColor(score)}`}>
              {score == null ? "—" : `${score}%`}
            </p>
            <p className="mt-1 text-[0.68rem] font-semibold uppercase tracking-wider text-ink-faint">
              Weighted score
            </p>
          </div>
        </div>

        {/* body */}
        <div className="thin-scroll flex-1 overflow-y-auto px-5 py-5">
          {/* 6-stage journey */}
          <p className="mb-3 text-[0.72rem] font-bold uppercase tracking-[0.06em] text-ink-faint">
            Evaluation journey
          </p>
          <div className="thin-scroll -mx-1 flex gap-1 overflow-x-auto px-1 pb-1">
            {reviewStages.map((s, i) => {
              const done = i < review.stage;
              const active = i === review.stage;
              return (
                <div key={s.label} className="flex min-w-24 flex-1 flex-col items-center text-center">
                  <div className="flex w-full items-center">
                    <span className={`h-0.5 flex-1 ${i === 0 ? "opacity-0" : done || active ? "bg-jade-500" : "bg-line"}`} />
                    <span
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[0.72rem] font-bold ${
                        done
                          ? "bg-jade-600 text-white"
                          : active
                            ? "bg-jade-600 text-white ring-4 ring-jade-100"
                            : "border border-line bg-paper-raised text-ink-faint"
                      }`}
                    >
                      {done ? <Icon name="check" className="h-3.5 w-3.5" strokeWidth={2.4} /> : i + 1}
                    </span>
                    <span className={`h-0.5 flex-1 ${i === lastStage ? "opacity-0" : done ? "bg-jade-500" : "bg-line"}`} />
                  </div>
                  <span className={`mt-1.5 text-[0.68rem] font-semibold leading-tight ${active ? "text-jade-700" : "text-ink-soft"}`}>
                    {s.label}
                  </span>
                </div>
              );
            })}
          </div>
          <p className="mt-2 rounded-lg bg-paper-sunken px-3 py-2 text-[0.78rem] text-ink-soft">
            <b className="text-ink">{reviewStages[review.stage].label}</b> —{" "}
            {reviewStages[review.stage].hint}
          </p>

          {/* KPI setup table */}
          <div className="mt-6 mb-2 flex items-center justify-between">
            <h3 className="font-display text-[0.95rem] font-bold">KPI setup &amp; scores</h3>
            <span className="text-[0.74rem] text-ink-faint">
              Weights total {review.kpis.reduce((s, k) => s + k.weight, 0)}%
            </span>
          </div>

          <div className="flex flex-col gap-2.5">
            {review.kpis.map((k) => {
              const ratio = attainment(k.target, k.actual, k.higherIsBetter);
              const st = statusFor(ratio);
              const pct = ratio == null ? 0 : Math.round(ratio * 100);
              const barTone =
                ratio == null
                  ? "bg-ink-faint"
                  : ratio >= 1
                    ? "bg-good"
                    : ratio >= 0.9
                      ? "bg-warn"
                      : "bg-critical";
              return (
                <div key={k.id} className="rounded-xl border border-line p-3.5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="flex items-center gap-2 text-[0.86rem] font-semibold">
                        {k.name}
                        {k.appeal && (
                          <span className="inline-flex items-center gap-1 text-gold-600" title="Under appeal">
                            <Icon name="flag" className="h-3.5 w-3.5" />
                          </span>
                        )}
                      </p>
                      <p className="mt-0.5 text-[0.74rem] text-ink-faint">
                        Weight {k.weight}% · Target {fmtVal(k.target, k.format)}
                        {k.higherIsBetter === false && " (lower is better)"}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="tnum text-[0.95rem] font-bold">{fmtVal(k.actual, k.format)}</p>
                      <Pill tone={st.tone}>{st.label}</Pill>
                    </div>
                  </div>
                  <div className="mt-2.5 flex items-center gap-2.5">
                    <div className="h-1.75 flex-1 overflow-hidden rounded-full bg-paper-sunken">
                      <div className={`h-full rounded-full ${barTone}`} style={{ width: `${Math.min(pct, 100)}%` }} />
                    </div>
                    <span className="tnum w-11 shrink-0 text-right text-[0.76rem] font-bold text-ink-soft">
                      {ratio == null ? "—" : `${pct}%`}
                    </span>
                  </div>

                  {k.appeal && (
                    <div className="mt-3 rounded-lg border border-gold-100 bg-gold-100/40 p-3">
                      <div className="flex items-center justify-between gap-2">
                        <p className="flex items-center gap-1.5 text-[0.78rem] font-bold text-gold-700">
                          <Icon name="flag" className="h-3.5 w-3.5" /> KPI appeal
                        </p>
                        <span className="text-[0.7rem] text-ink-faint">{k.appeal.filed}</span>
                      </div>
                      <p className="mt-1 text-[0.8rem] text-ink-soft">“{k.appeal.reason}”</p>
                      {k.appeal.status === "resolved" ? (
                        <p className="mt-2 flex items-center gap-1.5 text-[0.78rem] font-semibold text-jade-600">
                          <Icon name="check" className="h-3.5 w-3.5" strokeWidth={2.4} />
                          {k.appeal.outcome}
                        </p>
                      ) : (
                        <div className="mt-2.5 flex flex-wrap gap-2">
                          <Button variant="ghost" size="sm" onClick={() => onResolveAppeal(review.employeeId, k.id, "Upheld — score unchanged")}>
                            Uphold score
                          </Button>
                          <Button variant="soft" size="sm" onClick={() => onResolveAppeal(review.employeeId, k.id, "Adjusted — score revised")}>
                            Adjust score
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => onResolveAppeal(review.employeeId, k.id, "Dismissed — original stands")}>
                            Dismiss
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <p className="mt-3 flex items-start gap-2 text-[0.75rem] text-ink-soft">
            <Icon name="ai" className="mt-0.5 h-3.75 w-3.75 shrink-0 text-gold-600" />
            AI drafts scoring suggestions and flags anomalies, but final scores and appeal
            outcomes require a manager or owner. Every change is written to Audit History.
          </p>
        </div>

        {/* footer — advance the journey */}
        <div className="flex items-center justify-between gap-3 border-t border-line-soft px-5 py-3.5">
          <Button
            variant="ghost"
            size="md"
            disabled={review.stage === 0}
            onClick={() => onSetStage(review.employeeId, review.stage - 1)}
          >
            Back a stage
          </Button>
          {review.stage < lastStage ? (
            <Button
              variant="primary"
              size="md"
              icon="chevron-right"
              onClick={() => onSetStage(review.employeeId, review.stage + 1)}
            >
              {review.stage === lastStage - 1 ? "Publish results" : "Advance stage"}
            </Button>
          ) : (
            <Pill tone="good">Published</Pill>
          )}
        </div>
      </aside>
    </div>
  );
}
