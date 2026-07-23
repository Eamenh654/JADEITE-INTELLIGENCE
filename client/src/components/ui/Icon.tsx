import type { ReactNode, SVGProps } from "react";

export type IconName =
  | "home"
  | "companies"
  | "employees"
  | "kpis"
  | "bonuses"
  | "financials"
  | "ecommerce"
  | "integrations"
  | "ai"
  | "tasks"
  | "approvals"
  | "documents"
  | "reports"
  | "users"
  | "history"
  | "bell"
  | "sun"
  | "moon"
  | "calendar"
  | "search"
  | "menu"
  | "panel-left"
  | "download"
  | "shield-check"
  | "sparkle"
  | "chevron-right"
  | "chevron-down"
  | "arrow-up"
  | "arrow-down"
  | "plus"
  | "logout"
  | "external"
  | "archive"
  | "restore"
  | "more"
  | "filter"
  | "list"
  | "close"
  | "check"
  | "building"
  | "upload"
  | "mail"
  | "lock"
  | "eye"
  | "flag";

const paths: Record<IconName, ReactNode> = {
  home: <><path d="M3 10.5 10 4l7 6.5" /><path d="M5 9v7h10V9" /></>,
  companies: (
    <>
      <rect x="3" y="3" width="6" height="6" rx="1" />
      <rect x="11" y="3" width="6" height="6" rx="1" />
      <rect x="3" y="11" width="6" height="6" rx="1" />
      <rect x="11" y="11" width="6" height="6" rx="1" />
    </>
  ),
  employees: (
    <>
      <circle cx="7.5" cy="6.5" r="3" />
      <path d="M2.3 17c.4-3.2 2.6-5.2 5.2-5.2s4.8 2 5.2 5.2" />
      <circle cx="15" cy="7.5" r="2.2" />
      <path d="M13.2 17c.3-2.3 1.8-3.7 3-4" />
    </>
  ),
  kpis: (
    <>
      <circle cx="10" cy="10" r="7" />
      <circle cx="10" cy="10" r="3.6" />
      <circle cx="10" cy="10" r="0.9" fill="currentColor" />
    </>
  ),
  bonuses: (
    <>
      <circle cx="10" cy="7" r="4" />
      <path d="M7.4 10.5 6 17l4-2.1 4 2.1-1.4-6.5" />
    </>
  ),
  financials: (
    <>
      <path d="M4.5 16V9.5" />
      <path d="M10 16V4" />
      <path d="M15.5 16v-6.5" />
    </>
  ),
  ecommerce: (
    <>
      <path d="M6.2 7V5.2a3.8 3.8 0 0 1 7.6 0V7" />
      <rect x="3.6" y="7" width="12.8" height="9.6" rx="1.6" />
    </>
  ),
  integrations: (
    <>
      <rect x="3" y="3" width="9" height="9" rx="2" />
      <rect x="8" y="8" width="9" height="9" rx="2" />
    </>
  ),
  ai: <path d="M10 2.5 12 8l5.5 2-5.5 2-2 5.5-2-5.5L2.5 10 8 8Z" />,
  tasks: (
    <>
      <rect x="3" y="3" width="14" height="14" rx="2.5" />
      <path d="M6.5 10.3l2.1 2.1L14 7.5" />
    </>
  ),
  approvals: (
    <>
      <path d="M3 9.5h3.6l1.3 2.3h4.2l1.3-2.3H17" />
      <rect x="3" y="9.5" width="14" height="5.7" rx="1.2" />
      <path d="M3 9.5 4.8 4h10.4L17 9.5" />
    </>
  ),
  documents: <path d="M3 6.2a1 1 0 0 1 1-1h3.6l1.3 1.6H16a1 1 0 0 1 1 1v7.2a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1Z" />,
  reports: (
    <>
      <path d="M6 3h5l4 4v9a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" />
      <path d="M8 14v-3M10.3 14v-5M12.6 14v-2" />
    </>
  ),
  users: (
    <>
      <circle cx="10" cy="10" r="3" />
      <path d="M10 2.3v2.1M10 15.6v2.1M17.7 10h-2.1M4.4 10H2.3M15.4 4.6l-1.5 1.5M6.1 13.9l-1.5 1.5M15.4 15.4l-1.5-1.5M6.1 6.1 4.6 4.6" />
    </>
  ),
  history: (
    <>
      <path d="M2.6 10a7.4 7.4 0 1 1 2.3 5.4" />
      <path d="M2.6 14V10h4" />
      <path d="M10 5.8V10l3 1.8" />
    </>
  ),
  bell: (
    <>
      <path d="M10 3a4 4 0 0 0-4 4v2.3c0 1-.4 2-1.1 2.7L4 13h12l-.9-1c-.7-.7-1.1-1.7-1.1-2.7V7a4 4 0 0 0-4-4z" />
      <path d="M8.2 15.8a1.8 1.8 0 0 0 3.5 0" />
    </>
  ),
  sun: (
    <>
      <circle cx="10" cy="10" r="3.6" />
      <path d="M10 2.3v2M10 15.7v2M17.7 10h-2M4.3 10h-2M15.6 4.4l-1.4 1.4M5.8 14.2l-1.4 1.4M15.6 15.6l-1.4-1.4M5.8 5.8 4.4 4.4" />
    </>
  ),
  moon: <path d="M16.5 12.3A7 7 0 1 1 7.7 3.5a5.6 5.6 0 0 0 8.8 8.8Z" />,
  calendar: (
    <>
      <rect x="3" y="4.5" width="14" height="12" rx="2" />
      <path d="M3 8h14M7 3v3M13 3v3" />
    </>
  ),
  search: (
    <>
      <circle cx="9" cy="9" r="5.5" />
      <path d="m13.5 13.5 3 3" />
    </>
  ),
  menu: <path d="M3 5h14M3 10h14M3 15h14" />,
  "panel-left": (
    <>
      <rect x="3" y="4" width="14" height="12" rx="2" />
      <path d="M8 4v12" />
    </>
  ),
  download: (
    <>
      <path d="M10 3v10M6 9.5 10 13l4-3.5" />
      <path d="M4 16h12" />
    </>
  ),
  "shield-check": (
    <>
      <path d="M10 2 3 5v5c0 4.4 3 7.7 7 9 4-1.3 7-4.6 7-9V5l-7-3Z" />
      <path d="M7.3 10.2l1.9 1.9 3.5-4" />
    </>
  ),
  sparkle: <path d="M10 2.5 12 8l5.5 2-5.5 2-2 5.5-2-5.5L2.5 10 8 8Z" />,
  "chevron-right": <path d="m8 5 4 5-4 5" />,
  "chevron-down": <path d="m5 8 5 4 5-4" />,
  "arrow-up": <path d="M10 16V5M5.5 9 10 4.5 14.5 9" />,
  "arrow-down": <path d="M10 4v11M5.5 11 10 15.5 14.5 11" />,
  plus: <path d="M10 4v12M4 10h12" />,
  logout: (
    <>
      <path d="M8 16H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h3" />
      <path d="M12 13.5 15.5 10 12 6.5M15.5 10H8" />
    </>
  ),
  external: (
    <>
      <path d="M11 4h5v5" />
      <path d="M16 4 9 11" />
      <path d="M14 11.5V15a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h3.5" />
    </>
  ),
  archive: (
    <>
      <rect x="3" y="4" width="14" height="3.4" rx="1" />
      <path d="M4.5 7.4V15a1 1 0 0 0 1 1h9a1 1 0 0 0 1-1V7.4" />
      <path d="M8 10.5h4" />
    </>
  ),
  restore: (
    <>
      <path d="M3.4 9.5a6.8 6.8 0 1 1 .6 4" />
      <path d="M3.2 13.5V9.5h4" />
    </>
  ),
  more: (
    <>
      <circle cx="4.5" cy="10" r="1.15" fill="currentColor" stroke="none" />
      <circle cx="10" cy="10" r="1.15" fill="currentColor" stroke="none" />
      <circle cx="15.5" cy="10" r="1.15" fill="currentColor" stroke="none" />
    </>
  ),
  filter: <path d="M3.5 4.5h13l-5 6.2V15l-3 1.5v-6.8z" />,
  list: (
    <>
      <path d="M7 5h10M7 10h10M7 15h10" />
      <circle cx="3.6" cy="5" r="1" fill="currentColor" stroke="none" />
      <circle cx="3.6" cy="10" r="1" fill="currentColor" stroke="none" />
      <circle cx="3.6" cy="15" r="1" fill="currentColor" stroke="none" />
    </>
  ),
  close: <path d="M5 5l10 10M15 5 5 15" />,
  check: <path d="M4.5 10.5 8 14l7.5-8" />,
  building: (
    <>
      <path d="M4.5 17V4.6a1 1 0 0 1 1-1h9a1 1 0 0 1 1 1V17" />
      <path d="M3 17h14" />
      <path d="M7.5 7h1.6M11 7h1.6M7.5 10h1.6M11 10h1.6" />
      <path d="M8.3 17v-2.6h3.4V17" />
    </>
  ),
  upload: (
    <>
      <path d="M10 13.5V4M6.3 7.3 10 3.6l3.7 3.7" />
      <path d="M4.5 16.5h11" />
    </>
  ),
  mail: (
    <>
      <rect x="3" y="5" width="14" height="10" rx="2" />
      <path d="m3.5 6.5 6.5 4.7 6.5-4.7" />
    </>
  ),
  lock: (
    <>
      <rect x="4.5" y="9" width="11" height="7.5" rx="1.6" />
      <path d="M7 9V6.8a3 3 0 0 1 6 0V9" />
    </>
  ),
  eye: (
    <>
      <path d="M2.5 10S5.3 5 10 5s7.5 5 7.5 5-2.8 5-7.5 5-7.5-5-7.5-5z" />
      <circle cx="10" cy="10" r="2.2" />
    </>
  ),
  flag: (
    <>
      <path d="M5 3.2v13.6" />
      <path d="M5 4.2h9l-2 2.8 2 2.8H5" />
    </>
  ),
};

interface IconProps extends Omit<SVGProps<SVGSVGElement>, "name"> {
  name: IconName;
  className?: string;
}

export function Icon({ name, className, ...rest }: IconProps) {
  return (
    <svg
      viewBox="0 0 20 20"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...rest}
    >
      {paths[name]}
    </svg>
  );
}
