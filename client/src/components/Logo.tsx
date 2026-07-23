import logoUrl from "../assets/logo.png";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  withSubtitle?: boolean;
  className?: string;
}

const plate: Record<NonNullable<LogoProps["size"]>, string> = {
  sm: "h-9 px-2.5",
  md: "h-12 px-3.5",
  lg: "h-16 px-5",
};

/** Jadeite Ventures mark on a white plate (reads on any background). */
export function Logo({ size = "md", withSubtitle = false, className = "" }: LogoProps) {
  return (
    <div className={`flex flex-col items-center gap-2 ${className}`}>
      <div
        className={`inline-flex items-center justify-center rounded-md bg-white shadow-(--shadow-sm) ${plate[size]}`}
      >
        <img src={logoUrl} alt="Jadeite Ventures" className="h-full w-auto object-contain py-1.5" />
      </div>
      {withSubtitle && (
        <span className="font-display text-[0.62rem] font-medium uppercase tracking-[0.28em] text-white/55">
          Intelligence Hub
        </span>
      )}
    </div>
  );
}
