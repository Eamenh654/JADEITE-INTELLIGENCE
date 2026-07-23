import type { Tone } from "../../components/ui/Pill";
import { fmtUSD } from "../Companies/data";
import { attainment, initialReviews, weightedScore } from "../KPIs/data";

export { fmtUSD };

/* ---- Bonus round & the 6-step approval journey (spec §9) ----------- */

export const approvalSteps = [
  { label: "Draft", hint: "Calculated from KPI scores" },
  { label: "Manager Review", hint: "Company manager reviews" },
  { label: "Finance Check", hint: "Validated against the pool" },
  { label: "Owner Approval", hint: "Owner signs off" },
  { label: "Payroll", hint: "Scheduled for payment" },
  { label: "Paid", hint: "Completed" },
] as const;

export const QUARTER = "Q2 2026";

export interface BonusRound {
  quarter: string;
  step: number;
  pool: number;
}

export const initialRound: BonusRound = { quarter: QUARTER, step: 1, pool: 50_000 };

export type BonusDecision = "pending" | "approved" | "held";

export interface BonusLine {
  employeeId: string;
  targetBonus: number;
  decision: BonusDecision;
}

export const initialBonusLines: BonusLine[] = [
  { employeeId: "lena-park", targetBonus: 12_000, decision: "pending" },
  { employeeId: "sara-haddad", targetBonus: 10_000, decision: "pending" },
  { employeeId: "david-osei", targetBonus: 8_000, decision: "pending" },
  { employeeId: "marco-ruiz", targetBonus: 5_000, decision: "pending" },
  { employeeId: "priya-nair", targetBonus: 7_000, decision: "pending" },
  { employeeId: "nadia-reza", targetBonus: 6_000, decision: "pending" },
];

/* ---- Scores sourced from the KPI quarterly review ------------------ */

const reviewByEmp = Object.fromEntries(initialReviews.map((r) => [r.employeeId, r]));

export const scoreFor = (employeeId: string): number | null => {
  const r = reviewByEmp[employeeId];
  return r ? weightedScore(r.kpis) : null;
};

export const stageFor = (employeeId: string): number =>
  reviewByEmp[employeeId]?.stage ?? 0;

/** A line joins the round once its KPI review has reached Manager Review. */
export const isEligible = (employeeId: string): boolean =>
  scoreFor(employeeId) != null && stageFor(employeeId) >= 2;

/* ---- Payout maths -------------------------------------------------- */

export const PAYOUT_CAP = 120;

export const payoutMultiplier = (score: number | null): number | null =>
  score == null ? null : Math.min(score, PAYOUT_CAP) / 100;

export const bonusAmount = (target: number, score: number | null): number | null => {
  const m = payoutMultiplier(score);
  return m == null ? null : Math.round(target * m);
};

export interface Contribution {
  name: string;
  weight: number;
  points: number;
  dollars: number;
}

/** How each KPI contributed to this person's payout. */
export function contributions(employeeId: string, targetBonus: number): Contribution[] {
  const r = reviewByEmp[employeeId];
  if (!r) return [];
  return r.kpis
    .filter((k) => k.actual != null)
    .map((k) => {
      const a = attainment(k.target, k.actual, k.higherIsBetter) ?? 0;
      return {
        name: k.name,
        weight: k.weight,
        points: Math.round(a * k.weight),
        dollars: Math.round(targetBonus * (k.weight / 100) * a),
      };
    });
}

/* ---- Motivating tiers (spec §9 — the employee experience) ---------- */

export interface Tier {
  label: string;
  tone: Tone;
  color: string;
  message: string;
}

export function bonusTier(score: number | null): Tier {
  if (score == null)
    return { label: "Pending", tone: "neutral", color: "var(--ink-faint)", message: "Your bonus unlocks once this quarter's KPI review is complete." };
  if (score >= 110)
    return { label: "Outstanding", tone: "good", color: "var(--gold-600)", message: "An exceptional quarter — well above every target. 🎉" };
  if (score >= 100)
    return { label: "Exceeds target", tone: "good", color: "var(--jade-500)", message: "Above target across the board. Great quarter!" };
  if (score >= 90)
    return { label: "On target", tone: "good", color: "var(--jade-500)", message: "Right on target — solid, dependable delivery." };
  if (score >= 75)
    return { label: "Approaching", tone: "warn", color: "var(--warn)", message: "Close to target. A push on a couple of KPIs lifts your payout." };
  return { label: "Below target", tone: "critical", color: "var(--critical)", message: "Below target this quarter — let's rebuild next round." };
}
