import type { Tone } from "../../components/ui/Pill";
import { initialCompanies } from "../Companies/data";

/* ---- Access model (spec §6 — 6 granular permission levels) --------- */

export interface AccessLevel {
  id: number;
  label: string;
  short: string;
  desc: string;
}

export const accessLevels: AccessLevel[] = [
  { id: 0, label: "No Access", short: "None", desc: "Cannot see this area." },
  { id: 1, label: "View", short: "View", desc: "Read-only access." },
  { id: 2, label: "Contribute", short: "Contribute", desc: "Add and edit own entries." },
  { id: 3, label: "Manage", short: "Manage", desc: "Edit team and section data." },
  { id: 4, label: "Approve", short: "Approve", desc: "Approve items within scope." },
  { id: 5, label: "Admin", short: "Admin", desc: "Full control, including settings." },
];

/** Areas a per-user permission matrix is set across (spec §16). */
export const modules = [
  "Companies",
  "Financials",
  "E-Commerce",
  "KPIs",
  "Bonuses",
  "Integrations & AI",
  "Documents",
  "Users & Settings",
];

/** Everyone gets their headline level across areas; only Admin gets settings. */
export function permsFrom(
  level: number,
  overrides: Partial<Record<string, number>> = {},
): Record<string, number> {
  const base = Object.fromEntries(modules.map((m) => [m, level]));
  return { ...base, "Users & Settings": level >= 5 ? 5 : 0, ...overrides };
}

/** The homepage a person lands on after login, by access level. */
export function homepageFor(level: number): string {
  if (level >= 5) return "Group control center";
  if (level >= 4) return "Approvals & finance";
  if (level >= 3) return "Company workspace";
  if (level >= 1) return "My tasks & KPIs";
  return "Limited home";
}

/* ---- Scopes (Jadeite Group + each operating company) --------------- */

export interface Scope {
  code: string;
  name: string;
  color: string;
}

export const scopes: Scope[] = [
  { code: "GRP", name: "Jadeite Group", color: "#0F3324" },
  ...initialCompanies
    .filter((c) => !c.archived && c.stage !== "pipeline")
    .map((c) => ({ code: c.code, name: c.name, color: c.color })),
];

export const scopeByCode: Record<string, Scope> = Object.fromEntries(
  scopes.map((s) => [s.code, s]),
);

/* ---- Employees ----------------------------------------------------- */

export type EmpStatus = "active" | "invited" | "suspended";

export const statusMeta: Record<EmpStatus, { label: string; tone: Tone }> = {
  active: { label: "Active", tone: "good" },
  invited: { label: "Invited", tone: "info" },
  suspended: { label: "Suspended", tone: "critical" },
};

export interface Employee {
  id: string;
  name: string;
  initials: string;
  color: string;
  role: string;
  companyCode: string;
  department: string;
  /** Headline access level (0–5). */
  level: number;
  status: EmpStatus;
  lastActive: string;
  email: string;
  aiAssistant: boolean;
  permissions: Record<string, number>;
}

interface Seed {
  id: string;
  name: string;
  initials: string;
  color: string;
  role: string;
  companyCode: string;
  department: string;
  level: number;
  status: EmpStatus;
  lastActive: string;
  aiAssistant: boolean;
  overrides?: Partial<Record<string, number>>;
}

const seeds: Seed[] = [
  { id: "yeamen-hossen", name: "Yeamen Hossen", initials: "YH", color: "#B4894F", role: "Owner / Admin", companyCode: "GRP", department: "Executive", level: 5, status: "active", lastActive: "Online now", aiAssistant: true },
  { id: "amara-okafor", name: "Amara Okafor", initials: "AO", color: "#1B5B41", role: "Portfolio Controller", companyCode: "GRP", department: "Finance", level: 4, status: "active", lastActive: "20m ago", aiAssistant: true },
  { id: "david-osei", name: "David Osei", initials: "DO", color: "#227450", role: "Operations Lead", companyCode: "QY", department: "Operations", level: 3, status: "active", lastActive: "1h ago", aiAssistant: true },
  { id: "lena-park", name: "Lena Park", initials: "LP", color: "#8C6A34", role: "Finance Manager", companyCode: "QY", department: "Finance", level: 4, status: "active", lastActive: "3h ago", aiAssistant: true },
  { id: "marco-ruiz", name: "Marco Ruiz", initials: "MR", color: "#2E9C6B", role: "E-Commerce Analyst", companyCode: "QY", department: "E-Commerce", level: 2, status: "active", lastActive: "Today", aiAssistant: true, overrides: { "E-Commerce": 3 } },
  { id: "sara-haddad", name: "Sara Haddad", initials: "SH", color: "#A67C3D", role: "Company Manager", companyCode: "YO", department: "Management", level: 3, status: "active", lastActive: "Yesterday", aiAssistant: true },
  { id: "tom-becker", name: "Tom Becker", initials: "TB", color: "#54655A", role: "Supply Coordinator", companyCode: "YO", department: "Operations", level: 2, status: "active", lastActive: "2d ago", aiAssistant: false },
  { id: "priya-nair", name: "Priya Nair", initials: "PN", color: "#BE4430", role: "Marketing Lead", companyCode: "AM", department: "Marketing", level: 3, status: "active", lastActive: "5h ago", aiAssistant: true },
  { id: "omar-farouk", name: "Omar Farouk", initials: "OF", color: "#3C6EA0", role: "Growth Analyst", companyCode: "AM", department: "Marketing", level: 1, status: "invited", lastActive: "Invite sent", aiAssistant: false },
  { id: "nadia-reza", name: "Nadia Reza", initials: "NR", color: "#227450", role: "Founder / Product", companyCode: "CG", department: "Product", level: 3, status: "active", lastActive: "Today", aiAssistant: true },
  { id: "yuki-tanaka", name: "Yuki Tanaka", initials: "YT", color: "#8A9A8E", role: "R&D Associate", companyCode: "CG", department: "R&D", level: 2, status: "suspended", lastActive: "3w ago", aiAssistant: false },
];

const emailFor = (id: string) => `${id.replace(/-/g, ".")}@jadeite.io`;

export const initialEmployees: Employee[] = seeds.map((s) => ({
  id: s.id,
  name: s.name,
  initials: s.initials,
  color: s.color,
  role: s.role,
  companyCode: s.companyCode,
  department: s.department,
  level: s.level,
  status: s.status,
  lastActive: s.lastActive,
  email: emailFor(s.id),
  aiAssistant: s.aiAssistant,
  permissions: permsFrom(s.level, s.overrides),
}));
