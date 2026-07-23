import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className = "" }: CardProps) {
  return (
    <div
      className={`rounded-2xl border border-line bg-paper-raised shadow-(--shadow-sm) ${className}`}
    >
      {children}
    </div>
  );
}

interface CardHeadProps {
  title: ReactNode;
  meta?: ReactNode;
  action?: ReactNode;
  className?: string;
}

export function CardHead({ title, meta, action, className = "" }: CardHeadProps) {
  return (
    <div
      className={`flex items-center justify-between gap-3 border-b border-line-soft px-5 py-4 ${className}`}
    >
      <div className="flex items-baseline gap-2.5">
        <h3 className="font-display text-[1.02rem] font-bold">{title}</h3>
        {meta && <span className="text-[0.78rem] text-ink-soft">{meta}</span>}
      </div>
      {action}
    </div>
  );
}

export function CardBody({ children, className = "" }: CardProps) {
  return <div className={`p-5 ${className}`}>{children}</div>;
}
