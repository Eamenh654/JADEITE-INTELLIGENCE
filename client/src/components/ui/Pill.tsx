import type { ReactNode } from "react";

export type Tone = "good" | "warn" | "critical" | "info" | "neutral";

const tones: Record<Tone, string> = {
  good: "bg-good-bg text-good",
  warn: "bg-warn-bg text-warn",
  critical: "bg-critical-bg text-critical",
  info: "bg-info-bg text-info",
  neutral: "bg-paper-sunken text-ink-soft",
};

interface PillProps {
  tone?: Tone;
  children: ReactNode;
  /** Show the leading status dot. */
  dot?: boolean;
  className?: string;
}

export function Pill({ tone = "neutral", children, dot = true, className = "" }: PillProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[0.72rem] font-bold ${tones[tone]} ${className}`}
    >
      {dot && <span className="h-1.5 w-1.5 rounded-full bg-current" />}
      {children}
    </span>
  );
}

interface BadgeProps {
  children: ReactNode;
  tone?: "jade" | "gold";
  className?: string;
}

export function Badge({ children, tone = "jade", className = "" }: BadgeProps) {
  const cls =
    tone === "gold" ? "bg-gold-100 text-gold-700" : "bg-jade-100 text-jade-600";
  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-0.5 text-[0.68rem] font-bold uppercase tracking-[0.03em] ${cls} ${className}`}
    >
      {children}
    </span>
  );
}
