import { useEffect } from "react";
import { Button } from "../../components/ui/Button";
import { Pill } from "../../components/ui/Pill";
import { Icon } from "../../components/ui/Icon";
import { Avatar, ScopeTag } from "../Employees/parts";
import type { Employee } from "../Employees/data";
import {
  PAYOUT_CAP,
  approvalSteps,
  bonusAmount,
  bonusTier,
  contributions,
  fmtUSD,
  isEligible,
  payoutMultiplier,
  scoreFor,
  type BonusDecision,
  type BonusLine,
  type BonusRound,
} from "./data";

interface Props {
  line: BonusLine;
  employee: Employee;
  round: BonusRound;
  onClose: () => void;
  onDecision: (employeeId: string, decision: BonusDecision) => void;
}

export function BonusDrawer({ line, employee: e, round, onClose, onDecision }: Props) {
  useEffect(() => {
    const onKey = (ev: KeyboardEvent) => ev.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const score = scoreFor(e.id);
  const eligible = isEligible(e.id);
  const mult = payoutMultiplier(score);
  const amount = bonusAmount(line.targetBonus, score);
  const tier = bonusTier(score);
  const rows = contributions(e.id, line.targetBonus);
  const maxDollars = Math.max(1, ...rows.map((r) => r.dollars));

  return (
    <div className="fixed inset-0 z-50 flex">
      <button aria-label="Close" onClick={onClose} className="flex-1 bg-jade-950/45 backdrop-blur-sm" />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label={`Bonus for ${e.name}`}
        className="ml-auto flex h-full w-full max-w-lg flex-col border-l border-line bg-paper-raised shadow-(--shadow-lg)"
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
                <span className="text-[0.76rem] text-ink-faint">· {round.quarter}</span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="flex h-8.5 w-8.5 shrink-0 items-center justify-center rounded-[9px] border border-line text-ink-soft hover:bg-paper-sunken"
          >
            <Icon name="close" className="h-4.25 w-4.25" />
          </button>
        </div>

        {/* body */}
        <div className="thin-scroll flex-1 overflow-y-auto px-5 py-5">
          {/* payout summary */}
          <div className="rounded-2xl border border-line bg-paper-sunken/50 p-4">
            <div className="grid grid-cols-3 divide-x divide-line-soft text-center">
              <div className="px-2">
                <p className="text-[0.68rem] font-semibold uppercase tracking-wider text-ink-faint">Target</p>
                <p className="tnum mt-1 font-display text-[1.05rem] font-bold">{fmtUSD(line.targetBonus)}</p>
              </div>
              <div className="px-2">
                <p className="text-[0.68rem] font-semibold uppercase tracking-wider text-ink-faint">KPI score</p>
                <p className="tnum mt-1 font-display text-[1.05rem] font-bold" style={{ color: tier.color }}>
                  {score == null ? "—" : `${score}%`}
                </p>
              </div>
              <div className="px-2">
                <p className="text-[0.68rem] font-semibold uppercase tracking-wider text-ink-faint">Payout</p>
                <p className="tnum mt-1 font-display text-[1.05rem] font-bold text-jade-600">
                  {amount == null ? "—" : fmtUSD(amount)}
                </p>
              </div>
            </div>
            <p className="mt-3 border-t border-line-soft pt-2.5 text-center text-[0.76rem] text-ink-soft">
              {mult == null ? (
                "Payout is calculated once the KPI review is complete."
              ) : (
                <>
                  {fmtUSD(line.targetBonus)} × {Math.round(mult * 100)}% payout
                  {score != null && score > PAYOUT_CAP && ` (capped at ${PAYOUT_CAP}%)`} ={" "}
                  <b className="text-ink">{fmtUSD(amount ?? 0)}</b>
                </>
              )}
            </p>
          </div>

          {/* contribution breakdown */}
          {rows.length > 0 && (
            <>
              <p className="mt-6 mb-2 text-[0.72rem] font-bold uppercase tracking-[0.06em] text-ink-faint">
                How each KPI contributed
              </p>
              <div className="flex flex-col gap-3">
                {rows.map((r) => (
                  <div key={r.name}>
                    <div className="mb-1 flex items-center justify-between text-[0.82rem]">
                      <span className="font-medium">
                        {r.name} <span className="text-ink-faint">· {r.weight}%</span>
                      </span>
                      <span className="tnum font-semibold">{fmtUSD(r.dollars)}</span>
                    </div>
                    <div className="h-1.75 overflow-hidden rounded-full bg-paper-sunken">
                      <div
                        className="h-full rounded-full bg-linear-to-r from-jade-400 to-jade-600"
                        style={{ width: `${(r.dollars / maxDollars) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* round context */}
          <div className="mt-6 flex items-start gap-2 rounded-xl bg-paper-sunken px-3.5 py-3 text-[0.78rem] text-ink-soft">
            <Icon name="approvals" className="mt-0.5 h-4 w-4 shrink-0 text-jade-600" />
            <span>
              Round is at <b className="text-ink">{approvalSteps[round.step].label}</b>. Approvals
              are final at <b className="text-ink">Owner Approval</b>; every decision is written to
              Audit History. AI can flag outliers but cannot approve a payout.
            </span>
          </div>
        </div>

        {/* footer — decision */}
        <div className="flex items-center justify-between gap-3 border-t border-line-soft px-5 py-3.5">
          {!eligible ? (
            <Pill tone="neutral">Pending KPI review</Pill>
          ) : line.decision === "approved" ? (
            <div className="flex items-center gap-2.5">
              <Pill tone="good">Approved</Pill>
              <Button variant="ghost" size="sm" onClick={() => onDecision(e.id, "pending")}>Undo</Button>
            </div>
          ) : line.decision === "held" ? (
            <div className="flex items-center gap-2.5">
              <Pill tone="critical">On hold</Pill>
              <Button variant="ghost" size="sm" onClick={() => onDecision(e.id, "pending")}>Undo</Button>
            </div>
          ) : (
            <div className="flex gap-2.5">
              <Button variant="danger" size="md" icon="close" onClick={() => onDecision(e.id, "held")}>Hold</Button>
              <Button variant="primary" size="md" icon="check" onClick={() => onDecision(e.id, "approved")}>
                Approve {amount != null && fmtUSD(amount)}
              </Button>
            </div>
          )}
          <Button variant="ghost" size="md" onClick={onClose}>Done</Button>
        </div>
      </aside>
    </div>
  );
}
