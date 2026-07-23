import { Icon } from "./Icon";

interface StatCardProps {
  label: string;
  value: string;
  /** Small note under the value. */
  caption?: string;
  /** Signed delta line, e.g. "8.2% vs plan". */
  delta?: { direction: "up" | "down"; text: string };
}

export function StatCard({ label, value, caption, delta }: StatCardProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-line bg-paper-raised p-4.5 shadow-(--shadow-sm) transition-[box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:shadow-(--shadow-md)">
      {/* jade accent bar */}
      <span className="absolute inset-x-0 top-0 h-0.75 bg-linear-to-r from-jade-400 to-jade-600" />
      <p className="mb-2 text-[0.72rem] font-semibold uppercase tracking-[0.07em] text-ink-faint">
        {label}
      </p>
      <p className="font-display text-[1.55rem] font-bold leading-none tracking-[-0.01em] tnum">
        {value}
      </p>
      {delta && (
        <p
          className={`mt-1.5 flex items-center gap-1 text-[0.78rem] font-semibold tnum ${
            delta.direction === "up" ? "text-good" : "text-critical"
          }`}
        >
          <Icon
            name={delta.direction === "up" ? "arrow-up" : "arrow-down"}
            className="h-3.5 w-3.5"
            strokeWidth={2.2}
          />
          {delta.text}
        </p>
      )}
      {caption && !delta && <p className="mt-1.5 text-[0.78rem] text-ink-soft">{caption}</p>}
    </div>
  );
}
