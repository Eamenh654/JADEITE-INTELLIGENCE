import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Icon, type IconName } from "./Icon";

type Variant = "primary" | "ghost" | "soft" | "danger";
type Size = "sm" | "md";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  icon?: IconName;
  children?: ReactNode;
}

const base =
  "inline-flex items-center justify-center gap-2 rounded-md border font-semibold whitespace-nowrap transition-[filter,background,border-color,transform] duration-150 active:scale-[0.98] disabled:opacity-45 disabled:cursor-not-allowed disabled:active:scale-100";

const variants: Record<Variant, string> = {
  primary: "border-transparent bg-jade-700 text-white hover:brightness-110",
  ghost: "border-line bg-paper-raised text-ink hover:bg-paper-sunken",
  soft: "border-transparent bg-jade-100 text-jade-600 hover:brightness-95",
  danger: "border-transparent bg-critical-bg text-critical hover:brightness-105",
};

const sizes: Record<Size, string> = {
  sm: "px-3 py-1.5 text-[0.78rem]",
  md: "px-4 py-2.5 text-[0.85rem]",
};

export function Button({
  variant = "primary",
  size = "md",
  icon,
  children,
  className = "",
  ...rest
}: ButtonProps) {
  return (
    <button className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...rest}>
      {icon && <Icon name={icon} className="h-3.75 w-3.75 shrink-0" strokeWidth={1.8} />}
      {children}
    </button>
  );
}
