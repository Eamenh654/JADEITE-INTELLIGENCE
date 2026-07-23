import { useMemo, useState, type ReactNode } from "react";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { StatCard } from "../../components/ui/StatCard";
import { Pill } from "../../components/ui/Pill";
import { Icon } from "../../components/ui/Icon";
import { Avatar, LevelChip, ScopeTag } from "./parts";
import { EmployeeDrawer } from "./EmployeeDrawer";
import { InviteEmployeeModal } from "./InviteEmployeeModal";
import {
  initialEmployees,
  scopes,
  statusMeta,
  type Employee,
  type EmpStatus,
} from "./data";

type View = "grid" | "list";

export default function Employees() {
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);
  const [view, setView] = useState<View>("grid");
  const [query, setQuery] = useState("");
  const [scope, setScope] = useState<string>("all");
  const [status, setStatus] = useState<EmpStatus | "all">("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [inviteOpen, setInviteOpen] = useState(false);

  const update = (id: string, patch: Partial<Employee>) =>
    setEmployees((es) => es.map((e) => (e.id === id ? { ...e, ...patch } : e)));
  const setPermission = (id: string, module: string, level: number) =>
    setEmployees((es) =>
      es.map((e) =>
        e.id === id ? { ...e, permissions: { ...e.permissions, [module]: level } } : e,
      ),
    );
  const setEmpStatus = (id: string, s: EmpStatus) => update(id, { status: s });

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return employees.filter((e) => {
      if (scope !== "all" && e.companyCode !== scope) return false;
      if (status !== "all" && e.status !== status) return false;
      if (!q) return true;
      return (
        e.name.toLowerCase().includes(q) ||
        e.role.toLowerCase().includes(q) ||
        e.department.toLowerCase().includes(q) ||
        e.email.toLowerCase().includes(q)
      );
    });
  }, [employees, query, scope, status]);

  const summary = useMemo(
    () => ({
      total: employees.length,
      active: employees.filter((e) => e.status === "active").length,
      invited: employees.filter((e) => e.status === "invited").length,
      ai: employees.filter((e) => e.aiAssistant).length,
    }),
    [employees],
  );

  const scopeCount = (code: string) => employees.filter((e) => e.companyCode === code).length;
  const selected = employees.find((e) => e.id === selectedId) ?? null;

  return (
    <div className="flex flex-col gap-6">
      {/* Page head */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-display text-[0.82rem] font-medium italic text-gold-600">People</p>
          <h2 className="mt-0.5 font-display text-[1.6rem] font-bold">Employees &amp; access</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="ghost" size="sm" icon="download">Export directory</Button>
          <Button variant="primary" size="sm" icon="plus" onClick={() => setInviteOpen(true)}>
            Invite employee
          </Button>
        </div>
      </div>

      {/* Summary */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Employees" value={String(summary.total)} caption="Across 5 workspaces" />
        <StatCard label="Active now" value={String(summary.active)} caption="With portal access" />
        <StatCard label="Pending invites" value={String(summary.invited)} caption="Awaiting acceptance" />
        <StatCard label="AI Assistants on" value={String(summary.ai)} caption="Role-scoped assistants" />
      </div>

      {/* Toolbar */}
      <div className="flex flex-col gap-3">
        {/* scope chips */}
        <div className="thin-scroll -mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1">
          <FilterChip active={scope === "all"} onClick={() => setScope("all")}>
            All <span className="text-ink-faint">· {employees.length}</span>
          </FilterChip>
          {scopes.map((s) => (
            <FilterChip key={s.code} active={scope === s.code} onClick={() => setScope(s.code)}>
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: s.color }} />
              {s.name} <span className="text-ink-faint">· {scopeCount(s.code)}</span>
            </FilterChip>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <label className="flex flex-1 items-center gap-2 rounded-md border border-line bg-paper-raised px-3 py-2 text-ink-soft focus-within:border-jade-500 lg:flex-none">
            <Icon name="search" className="h-4 w-4" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search name, role, email…"
              className="w-full bg-transparent text-[0.83rem] placeholder:text-ink-faint focus:outline-none lg:w-56"
            />
          </label>

          <select
            aria-label="Filter by status"
            value={status}
            onChange={(e) => setStatus(e.target.value as EmpStatus | "all")}
            className="h-9 rounded-md border border-line bg-paper-raised px-3 text-[0.8rem] font-semibold text-ink-soft focus:border-jade-500 focus:outline-none"
          >
            <option value="all">All statuses</option>
            <option value="active">Active</option>
            <option value="invited">Invited</option>
            <option value="suspended">Suspended</option>
          </select>

          <div className="flex overflow-hidden rounded-md border border-line">
            {(["grid", "list"] as const).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                aria-label={`${v} view`}
                className={`flex h-9 w-9 items-center justify-center transition-colors ${
                  view === v
                    ? "bg-jade-100 text-jade-600"
                    : "bg-paper-raised text-ink-faint hover:bg-paper-sunken"
                }`}
              >
                <Icon name={v === "grid" ? "companies" : "list"} className="h-4.25 w-4.25" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      {filtered.length === 0 ? (
        <EmptyState query={query} />
      ) : view === "grid" ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((e) => (
            <EmployeeCard key={e.id} e={e} onOpen={() => setSelectedId(e.id)} />
          ))}
        </div>
      ) : (
        <EmployeeTable rows={filtered} onOpen={setSelectedId} />
      )}

      {selected && (
        <EmployeeDrawer
          employee={selected}
          onClose={() => setSelectedId(null)}
          onUpdate={update}
          onSetPermission={setPermission}
          onSetStatus={setEmpStatus}
        />
      )}

      {inviteOpen && (
        <InviteEmployeeModal
          onClose={() => setInviteOpen(false)}
          onInvite={(e) => {
            setEmployees((es) => [e, ...es]);
            setInviteOpen(false);
          }}
        />
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-3 py-1.5 text-[0.8rem] font-semibold transition-colors ${
        active
          ? "border-jade-500 bg-jade-100 text-jade-700"
          : "border-line bg-paper-raised text-ink-soft hover:bg-paper-sunken"
      }`}
    >
      {children}
    </button>
  );
}

function AiTag() {
  return (
    <span className="inline-flex items-center gap-1 rounded-md bg-jade-50 px-1.5 py-0.5 text-[0.64rem] font-bold text-jade-600">
      <Icon name="sparkle" className="h-3 w-3" /> AI
    </span>
  );
}

function EmployeeCard({ e, onOpen }: { e: Employee; onOpen: () => void }) {
  const status = statusMeta[e.status];
  return (
    <button
      onClick={onOpen}
      className="flex flex-col rounded-2xl border border-line bg-paper-raised p-4.5 text-left shadow-(--shadow-sm) transition-shadow hover:shadow-(--shadow-md)"
    >
      <div className="flex items-start gap-3">
        <Avatar person={e} />
        <div className="min-w-0 flex-1">
          <p className="truncate font-display text-[1.02rem] font-bold leading-tight">{e.name}</p>
          <p className="mt-0.5 truncate text-[0.78rem] text-ink-soft">{e.role}</p>
        </div>
        <Pill tone={status.tone}>{status.label}</Pill>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5">
        <ScopeTag code={e.companyCode} />
        <span className="text-[0.76rem] text-ink-faint">·</span>
        <span className="text-[0.76rem] text-ink-soft">{e.department}</span>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-line-soft pt-3.5">
        <div className="flex items-center gap-2">
          <LevelChip level={e.level} />
          {e.aiAssistant && <AiTag />}
        </div>
        <span className="flex items-center gap-1 text-[0.78rem] font-semibold text-jade-600">
          Manage access
          <Icon name="chevron-right" className="h-3.5 w-3.5" />
        </span>
      </div>
    </button>
  );
}

function EmployeeTable({
  rows,
  onOpen,
}: {
  rows: Employee[];
  onOpen: (id: string) => void;
}) {
  return (
    <Card>
      <div className="thin-scroll overflow-x-auto">
        <table className="w-full text-[0.85rem]">
          <thead>
            <tr className="border-b border-line text-left">
              {["Employee", "Company", "Department", "Access", "Status", "Last active", ""].map((h) => (
                <th
                  key={h}
                  className="whitespace-nowrap px-4 py-2.5 text-[0.7rem] font-bold uppercase tracking-[0.06em] text-ink-faint"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((e) => {
              const status = statusMeta[e.status];
              return (
                <tr
                  key={e.id}
                  onClick={() => onOpen(e.id)}
                  className="cursor-pointer border-b border-line-soft transition-colors last:border-0 hover:bg-paper-sunken"
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
                  <td className="whitespace-nowrap px-4 py-3">
                    <ScopeTag code={e.companyCode} />
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-ink-soft">{e.department}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <LevelChip level={e.level} />
                      {e.aiAssistant && <AiTag />}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Pill tone={status.tone}>{status.label}</Pill>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-ink-soft">{e.lastActive}</td>
                  <td className="px-4 py-3 text-right">
                    <Icon name="chevron-right" className="ml-auto h-4 w-4 text-ink-faint" />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

function EmptyState({ query }: { query: string }) {
  return (
    <div className="flex min-h-[30vh] flex-col items-center justify-center rounded-2xl border border-dashed border-line bg-paper-raised/50 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-jade-100 text-jade-600">
        <Icon name="employees" className="h-6 w-6" />
      </span>
      <p className="mt-4 font-display text-[1.1rem] font-bold">No people found</p>
      <p className="mt-1 max-w-sm text-[0.83rem] text-ink-soft">
        {query
          ? `Nothing matches “${query}”. Try a different search or clear the filters.`
          : "Adjust the filters to see employees in this view."}
      </p>
    </div>
  );
}
