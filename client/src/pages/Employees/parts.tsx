import { accessLevels, scopeByCode } from "./data";

export function Avatar({
  person,
  size = "md",
}: {
  person: { initials: string; color: string };
  size?: "sm" | "md" | "lg";
}) {
  const cls =
    size === "sm"
      ? "h-8 w-8 rounded-lg text-[0.7rem]"
      : size === "lg"
        ? "h-12 w-12 rounded-xl text-[0.95rem]"
        : "h-10 w-10 rounded-xl text-[0.8rem]";
  return (
    <span
      className={`flex shrink-0 items-center justify-center font-display font-bold text-white ${cls}`}
      style={{ backgroundColor: person.color }}
    >
      {person.initials}
    </span>
  );
}

const levelChipClass: Record<number, string> = {
  0: "bg-paper-sunken text-ink-soft",
  1: "bg-info-bg text-info",
  2: "bg-jade-50 text-jade-600",
  3: "bg-jade-100 text-jade-700",
  4: "bg-gold-100 text-gold-700",
  5: "bg-jade-600 text-white",
};

export function LevelChip({ level }: { level: number }) {
  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-0.5 text-[0.68rem] font-bold uppercase tracking-[0.03em] ${levelChipClass[level]}`}
    >
      {accessLevels[level].short}
    </span>
  );
}

export function ScopeTag({ code }: { code: string }) {
  const s = scopeByCode[code];
  if (!s) return null;
  return (
    <span className="inline-flex items-center gap-1.5 text-[0.76rem] font-medium text-ink-soft">
      <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: s.color }} />
      {s.name}
    </span>
  );
}
