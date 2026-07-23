import { useMemo, useState } from "react";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { StatCard } from "../../components/ui/StatCard";
import { Pill } from "../../components/ui/Pill";
import { Icon } from "../../components/ui/Icon";
import { Avatar, ScopeTag } from "../Employees/parts";
import { reviewEmployee } from "../KPIs/data";
import { BonusDrawer } from "./BonusDrawer";
import {
  approvalSteps,
  bonusAmount,
  bonusTier,
  contributions,
  fmtUSD,
  initialBonusLines,
  initialRound,
  isEligible,
  payoutMultiplier,
  scoreFor,
  type BonusDecision,
  type BonusLine,
} from "./data";

type Tab = "round" | "employee";

export default function Bonuses() {
  const [tab, setTab] = useState<Tab>("round");
  const [round, setRound] = useState(initialRound);
  const [lines, setLines] = useState<BonusLine[]>(initialBonusLines);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const setDecision = (employeeId: string, decision: BonusDecision) =>
    setLines((ls) => ls.map((l) => (l.employeeId === employeeId ? { ...l, decision } : l)));

  const approveAll = () =>
    setLines((ls) =>
      ls.map((l) =>
        isEligible(l.employeeId) && l.decision === "pending" ? { ...l, decision: "approved" } : l,
      ),
    );

  const selectedLine = lines.find((l) => l.employeeId === selectedId) ?? null;
  const selectedEmp = selectedLine && reviewEmployee(selectedLine.employeeId);

  return (
    <div className="flex flex-col gap-6">
      {/* head + tabs */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-display text-[0.82rem] font-medium italic text-gold-600">Rewards</p>
          <h2 className="mt-0.5 font-display text-[1.6rem] font-bold">Bonuses</h2>
        </div>
        <div className="flex rounded-md border border-line bg-paper-raised p-0.5">
          {(
            [
              { id: "round", label: "Bonus round" },
              { id: "employee", label: "Employee view" },
            ] as const
          ).map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`rounded-[7px] px-3.5 py-1.5 text-[0.82rem] font-semibold transition-colors ${
                tab === t.id ? "bg-jade-100 text-jade-700" : "text-ink-soft hover:bg-paper-sunken"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {tab === "round" ? (
        <RoundTab
          round={round}
          lines={lines}
          onStep={(step) => setRound((r) => ({ ...r, step }))}
          onOpen={setSelectedId}
          onApproveAll={approveAll}
          onDecision={setDecision}
        />
      ) : (
        <EmployeeView lines={lines} />
      )}

      {selectedLine && selectedEmp && (
        <BonusDrawer
          line={selectedLine}
          employee={selectedEmp}
          round={round}
          onClose={() => setSelectedId(null)}
          onDecision={setDecision}
        />
      )}
    </div>
  );
}

/* ------------------------------ Round tab ------------------------- */

function RoundTab({
  round,
  lines,
  onStep,
  onOpen,
  onApproveAll,
  onDecision,
}: {
  round: typeof initialRound;
  lines: BonusLine[];
  onStep: (step: number) => void;
  onOpen: (id: string) => void;
  onApproveAll: () => void;
  onDecision: (employeeId: string, decision: BonusDecision) => void;
}) {
  const summary = useMemo(() => {
    const eligible = lines.filter((l) => isEligible(l.employeeId));
    const proposed = eligible.reduce((s, l) => s + (bonusAmount(l.targetBonus, scoreFor(l.employeeId)) ?? 0), 0);
    const approved = eligible
      .filter((l) => l.decision === "approved")
      .reduce((s, l) => s + (bonusAmount(l.targetBonus, scoreFor(l.employeeId)) ?? 0), 0);
    const awaiting = eligible.filter((l) => l.decision === "pending").length;
    return { proposed, approved, awaiting, eligible: eligible.length };
  }, [lines]);

  const lastStep = approvalSteps.length - 1;
  const util = Math.min(100, Math.round((summary.proposed / round.pool) * 100));

  return (
    <>
      {/* 6-step approval journey */}
      <div className="rounded-2xl border border-line bg-brand-panel px-5 py-4 text-white">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="font-display text-[0.78rem] font-medium italic text-gold-500">Approval journey</p>
            <p className="font-display text-[1.15rem] font-bold">{round.quarter} bonus round</p>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" disabled={round.step === 0} onClick={() => onStep(round.step - 1)}>
              Back
            </Button>
            {round.step < lastStep ? (
              <Button variant="soft" size="sm" icon="chevron-right" onClick={() => onStep(round.step + 1)}>
                {round.step === lastStep - 1 ? "Mark as paid" : "Advance step"}
              </Button>
            ) : (
              <Pill tone="good">Paid</Pill>
            )}
          </div>
        </div>
        <div className="thin-scroll mt-4 flex gap-1 overflow-x-auto pb-1">
          {approvalSteps.map((s, i) => {
            const done = i < round.step;
            const active = i === round.step;
            return (
              <div key={s.label} className="flex min-w-24 flex-1 flex-col items-center text-center">
                <div className="flex w-full items-center">
                  <span className={`h-0.5 flex-1 ${i === 0 ? "opacity-0" : done || active ? "bg-gold-500" : "bg-white/20"}`} />
                  <span
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[0.72rem] font-bold ${
                      done ? "bg-white text-jade-800" : active ? "bg-gold-500 text-jade-950 ring-4 ring-white/20" : "border border-white/30 text-white/60"
                    }`}
                  >
                    {done ? <Icon name="check" className="h-3.5 w-3.5" strokeWidth={2.4} /> : i + 1}
                  </span>
                  <span className={`h-0.5 flex-1 ${i === lastStep ? "opacity-0" : done ? "bg-gold-500" : "bg-white/20"}`} />
                </div>
                <span className={`mt-1.5 text-[0.68rem] font-semibold leading-tight ${active ? "text-white" : "text-white/70"}`}>
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* summary */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Bonus pool" value={fmtUSD(round.pool)} caption={`${util}% proposed`} />
        <StatCard label="Proposed" value={fmtUSD(summary.proposed)} caption={`${summary.eligible} eligible employees`} />
        <StatCard label="Approved" value={fmtUSD(summary.approved)} caption="Ready for payroll" />
        <StatCard label="Awaiting approval" value={String(summary.awaiting)} caption="Pending your decision" />
      </div>

      {/* lines */}
      <div className="flex items-center justify-between">
        <h3 className="font-display text-[1.08rem] font-bold">Employee bonuses</h3>
        <Button variant="soft" size="sm" icon="check" onClick={onApproveAll} disabled={summary.awaiting === 0}>
          Approve all eligible
        </Button>
      </div>

      <Card>
        <div className="thin-scroll overflow-x-auto">
          <table className="w-full text-[0.85rem]">
            <thead>
              <tr className="border-b border-line text-left">
                {["Employee", "Company", "KPI score", "Target", "Payout", "Bonus", "Decision"].map((h) => (
                  <th key={h} className="whitespace-nowrap px-4 py-2.5 text-[0.7rem] font-bold uppercase tracking-[0.06em] text-ink-faint last:text-right">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {lines.map((l) => {
                const e = reviewEmployee(l.employeeId);
                if (!e) return null;
                const score = scoreFor(l.employeeId);
                const eligible = isEligible(l.employeeId);
                const amount = bonusAmount(l.targetBonus, score);
                const mult = payoutMultiplier(score);
                const tier = bonusTier(score);
                return (
                  <tr
                    key={l.employeeId}
                    onClick={() => onOpen(l.employeeId)}
                    className={`border-b border-line-soft transition-colors last:border-0 hover:bg-paper-sunken ${eligible ? "cursor-pointer" : "opacity-70"}`}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <Avatar person={e} size="sm" />
                        <div className="min-w-0">
                          <p className="font-semibold">{e.name}</p>
                          <p className="text-[0.74rem] text-ink-faint">{e.role}</p>
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3"><ScopeTag code={e.companyCode} /></td>
                    <td className="tnum whitespace-nowrap px-4 py-3 font-semibold" style={{ color: score == null ? undefined : tier.color }}>
                      {score == null ? "—" : `${score}%`}
                    </td>
                    <td className="tnum whitespace-nowrap px-4 py-3 text-ink-soft">{fmtUSD(l.targetBonus)}</td>
                    <td className="tnum whitespace-nowrap px-4 py-3 text-ink-soft">{mult == null ? "—" : `${Math.round(mult * 100)}%`}</td>
                    <td className="tnum whitespace-nowrap px-4 py-3 font-bold">{amount == null ? "—" : fmtUSD(amount)}</td>
                    <td className="px-4 py-3 text-right" onClick={(ev) => ev.stopPropagation()}>
                      <DecisionCell eligible={eligible} decision={l.decision} onDecision={(d) => onDecision(l.employeeId, d)} />
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

function DecisionCell({
  eligible,
  decision,
  onDecision,
}: {
  eligible: boolean;
  decision: BonusDecision;
  onDecision: (d: BonusDecision) => void;
}) {
  if (!eligible)
    return <span className="text-[0.74rem] font-semibold text-ink-faint">Pending KPI</span>;
  if (decision === "approved")
    return (
      <button onClick={() => onDecision("pending")} className="ml-auto inline-flex" title="Click to undo">
        <Pill tone="good">Approved</Pill>
      </button>
    );
  if (decision === "held")
    return (
      <button onClick={() => onDecision("pending")} className="ml-auto inline-flex" title="Click to undo">
        <Pill tone="critical">On hold</Pill>
      </button>
    );
  return (
    <div className="flex justify-end gap-1.5">
      <Button variant="ghost" size="sm" onClick={() => onDecision("held")}>Hold</Button>
      <Button variant="primary" size="sm" onClick={() => onDecision("approved")}>Approve</Button>
    </div>
  );
}

/* ---------------------------- Employee view ----------------------- */

function EmployeeView({ lines }: { lines: BonusLine[] }) {
  const eligible = lines.filter((l) => isEligible(l.employeeId));
  const [empId, setEmpId] = useState(eligible[0]?.employeeId ?? "");
  const line = lines.find((l) => l.employeeId === empId);
  const e = line && reviewEmployee(line.employeeId);

  if (!line || !e) {
    return (
      <div className="rounded-2xl border border-dashed border-line bg-paper-raised/50 px-5 py-16 text-center text-ink-soft">
        No scored bonuses to preview yet.
      </div>
    );
  }

  const score = scoreFor(empId);
  const tier = bonusTier(score);
  const amount = bonusAmount(line.targetBonus, score);
  const rows = contributions(empId, line.targetBonus);
  const maxD = Math.max(1, ...rows.map((r) => r.dollars));

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="flex items-center gap-2 text-[0.82rem] text-ink-soft">
          <Icon name="eye" className="h-4 w-4 text-jade-600" />
          Previewing what the employee sees
        </p>
        <select
          aria-label="Choose employee"
          value={empId}
          onChange={(ev) => setEmpId(ev.target.value)}
          className="h-9 rounded-md border border-line bg-paper-raised px-3 text-[0.82rem] font-semibold text-ink focus:border-jade-500 focus:outline-none"
        >
          {eligible.map((l) => {
            const emp = reviewEmployee(l.employeeId);
            return (
              <option key={l.employeeId} value={l.employeeId}>
                {emp?.name}
              </option>
            );
          })}
        </select>
      </div>

      {/* hero */}
      <Card className="overflow-hidden">
        <div className="bg-aura flex flex-col items-center gap-6 p-6 sm:flex-row sm:items-center sm:gap-8 sm:p-8">
          <Ring score={score ?? 0} color={tier.color} />
          <div className="min-w-0 flex-1 text-center sm:text-left">
            <div className="flex items-center justify-center gap-2 sm:justify-start">
              <Avatar person={e} size="sm" />
              <span className="font-semibold">{e.name}</span>
              <Pill tone={tier.tone}>{tier.label}</Pill>
            </div>
            <p className="mt-3 font-display text-[0.85rem] font-medium italic text-gold-600">
              Your {initialRound.quarter} bonus
            </p>
            <p className="tnum font-display text-[2.6rem] font-bold leading-none">{fmtUSD(amount ?? 0)}</p>
            <p className="mt-2 max-w-md text-[0.88rem] text-ink-soft">{tier.message}</p>
            <p className="mt-3 text-[0.78rem] text-ink-faint">
              {fmtUSD(line.targetBonus)} target · {score}% of goals achieved
            </p>
          </div>
        </div>
      </Card>

      {/* contribution */}
      <Card className="p-5">
        <h3 className="font-display text-[1.02rem] font-bold">What drove your bonus</h3>
        <p className="mt-0.5 text-[0.8rem] text-ink-soft">
          Each KPI adds to your payout by its weight and how far you beat target.
        </p>
        <div className="mt-4 flex flex-col gap-3.5">
          {rows.map((r) => (
            <div key={r.name}>
              <div className="mb-1 flex items-center justify-between text-[0.83rem]">
                <span className="font-medium">
                  {r.name} <span className="text-ink-faint">· weight {r.weight}%</span>
                </span>
                <span className="tnum font-bold text-jade-600">+{fmtUSD(r.dollars)}</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-paper-sunken">
                <div className="h-full rounded-full bg-linear-to-r from-jade-400 to-jade-600" style={{ width: `${(r.dollars / maxD) * 100}%` }} />
              </div>
            </div>
          ))}
        </div>
        <p className="mt-4 flex items-start gap-2 border-t border-line-soft pt-3 text-[0.76rem] text-ink-soft">
          <Icon name="sparkle" className="mt-0.5 h-3.75 w-3.75 shrink-0 text-gold-600" />
          Keep it up — small gains on your lowest KPI lift next quarter's payout the most.
        </p>
      </Card>
    </>
  );
}

function Ring({ score, color }: { score: number; color: string }) {
  const size = 140;
  const stroke = 13;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const val = Math.min(score, 120) / 120;
  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="h-35 w-35 shrink-0">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--paper-sunken)" strokeWidth={stroke} />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={c * (1 - val)}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
      <text x="50%" y="47%" textAnchor="middle" dominantBaseline="middle" style={{ fill: "var(--ink)", fontFamily: "var(--font-display)", fontSize: "1.9rem", fontWeight: 700 }}>
        {score}%
      </text>
      <text x="50%" y="63%" textAnchor="middle" dominantBaseline="middle" style={{ fill: "var(--ink-faint)", fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.08em" }}>
        OF TARGET
      </text>
    </svg>
  );
}
