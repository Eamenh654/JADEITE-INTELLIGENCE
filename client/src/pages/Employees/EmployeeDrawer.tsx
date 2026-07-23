import { useEffect } from "react";
import { Button } from "../../components/ui/Button";
import { Pill } from "../../components/ui/Pill";
import { Icon } from "../../components/ui/Icon";
import { Avatar, LevelChip, ScopeTag } from "./parts";
import {
  accessLevels,
  homepageFor,
  modules,
  statusMeta,
  type Employee,
  type EmpStatus,
} from "./data";

interface DrawerProps {
  employee: Employee;
  onClose: () => void;
  onUpdate: (id: string, patch: Partial<Employee>) => void;
  onSetPermission: (id: string, module: string, level: number) => void;
  onSetStatus: (id: string, status: EmpStatus) => void;
}

function Switch({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      role="switch"
      aria-checked={on}
      onClick={() => onChange(!on)}
      className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
        on ? "bg-jade-600" : "border border-line bg-paper-sunken"
      }`}
    >
      <span
        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${
          on ? "left-5.5" : "left-0.5"
        }`}
      />
    </button>
  );
}

export function EmployeeDrawer({
  employee: e,
  onClose,
  onUpdate,
  onSetPermission,
  onSetStatus,
}: DrawerProps) {
  useEffect(() => {
    const onKey = (ev: KeyboardEvent) => ev.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const firstName = e.name.split(" ")[0];
  const status = statusMeta[e.status];

  return (
    <div className="fixed inset-0 z-50 flex">
      <button aria-label="Close" onClick={onClose} className="flex-1 bg-jade-950/45 backdrop-blur-sm" />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label={`Access for ${e.name}`}
        className="ml-auto flex h-full w-full max-w-lg flex-col border-l border-line bg-paper-raised shadow-(--shadow-lg)"
      >
        {/* header */}
        <div className="flex items-start justify-between gap-3 border-b border-line-soft px-5 py-4">
          <div className="flex items-center gap-3">
            <Avatar person={e} size="lg" />
            <div className="min-w-0">
              <h2 className="font-display text-[1.2rem] font-bold leading-tight">{e.name}</h2>
              <p className="text-[0.83rem] text-ink-soft">{e.role}</p>
              <div className="mt-1.5 flex flex-wrap items-center gap-2">
                <ScopeTag code={e.companyCode} />
                <Pill tone={status.tone}>{status.label}</Pill>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="flex h-8.5 w-8.5 shrink-0 items-center justify-center rounded-[9px] border border-line text-ink-soft hover:bg-paper-sunken"
          >
            <Icon name="close" className="h-4.25 w-4.25" />
          </button>
        </div>

        {/* body */}
        <div className="thin-scroll flex-1 overflow-y-auto px-5 py-5">
          {/* contact + department */}
          <div className="grid grid-cols-2 gap-3">
            <InfoTile icon="mail" label="Email" value={e.email} />
            <InfoTile icon="employees" label="Department" value={e.department} />
          </div>

          {/* role-based homepage */}
          <SectionLabel>Role-based homepage</SectionLabel>
          <div className="flex items-center gap-3 rounded-xl border border-line bg-paper-sunken px-3.5 py-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-jade-100 text-jade-600">
              <Icon name="home" className="h-4.5 w-4.5" />
            </span>
            <div className="min-w-0">
              <p className="text-[0.86rem] font-semibold">{homepageFor(e.level)}</p>
              <p className="text-[0.76rem] text-ink-soft">Where {firstName} lands after login</p>
            </div>
          </div>

          {/* Employee AI Assistant */}
          <SectionLabel>Employee AI Assistant</SectionLabel>
          <div className="rounded-xl border border-line p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-jade-100 text-jade-600">
                  <Icon name="sparkle" className="h-4.5 w-4.5" />
                </span>
                <div>
                  <p className="text-[0.86rem] font-semibold">
                    {e.aiAssistant ? "Enabled" : "Disabled"}
                  </p>
                  <p className="text-[0.76rem] text-ink-soft">Scoped to this person's access</p>
                </div>
              </div>
              <Switch on={e.aiAssistant} onChange={(v) => onUpdate(e.id, { aiAssistant: v })} />
            </div>
            <p className="mt-3 flex items-start gap-2 border-t border-line-soft pt-3 text-[0.76rem] text-ink-soft">
              <Icon name="shield-check" className="mt-0.5 h-4 w-4 shrink-0 text-jade-600" />
              The assistant can answer questions and recommend actions on data {firstName} can
              already see. It cannot approve, change permissions, or reveal masked figures.
            </p>
          </div>

          {/* Permission matrix */}
          <div className="mt-6 mb-2 flex items-center gap-2">
            <Icon name="lock" className="h-4 w-4 text-ink-soft" />
            <h3 className="font-display text-[0.95rem] font-bold">Access by area</h3>
            <span className="text-[0.74rem] text-ink-faint">6 levels · per area</span>
          </div>
          <div className="rounded-xl border border-line px-4">
            {modules.map((m) => {
              const value = e.permissions[m] ?? 0;
              return (
                <div key={m} className="border-b border-line-soft py-3 last:border-0">
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <span className="text-[0.84rem] font-semibold">{m}</span>
                    <span className="text-[0.72rem] text-ink-soft">{accessLevels[value].desc}</span>
                  </div>
                  <div className="flex overflow-hidden rounded-lg border border-line">
                    {accessLevels.map((l) => {
                      const sel = value === l.id;
                      return (
                        <button
                          key={l.id}
                          onClick={() => onSetPermission(e.id, m, l.id)}
                          title={`${l.label} — ${l.desc}`}
                          className={`flex-1 border-r border-line px-1 py-1.5 text-[0.64rem] font-semibold whitespace-nowrap transition-colors last:border-0 ${
                            sel
                              ? "bg-jade-600 text-white"
                              : "bg-paper-raised text-ink-faint hover:bg-paper-sunken"
                          }`}
                        >
                          {l.short}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
          <p className="mt-2.5 flex items-start gap-2 text-[0.75rem] text-ink-soft">
            <Icon name="ai" className="mt-0.5 h-3.75 w-3.75 shrink-0 text-gold-600" />
            AI can recommend access changes, but only an Admin can apply them. Every change is
            written to Audit History.
          </p>
        </div>

        {/* footer */}
        <div className="flex items-center justify-between gap-3 border-t border-line-soft px-5 py-3.5">
          {e.status === "suspended" ? (
            <Button variant="soft" size="md" icon="restore" onClick={() => onSetStatus(e.id, "active")}>
              Reactivate
            </Button>
          ) : e.status === "invited" ? (
            <Button variant="ghost" size="md" icon="mail">
              Resend invite
            </Button>
          ) : (
            <Button variant="danger" size="md" icon="lock" onClick={() => onSetStatus(e.id, "suspended")}>
              Suspend access
            </Button>
          )}
          <div className="flex items-center gap-2.5">
            <span className="hidden text-[0.76rem] text-ink-faint sm:inline">
              Overall <LevelChip level={e.level} />
            </span>
            <Button variant="primary" size="md" icon="check" onClick={onClose}>
              Done
            </Button>
          </div>
        </div>
      </aside>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-6 mb-2 text-[0.72rem] font-bold uppercase tracking-[0.06em] text-ink-faint">
      {children}
    </p>
  );
}

function InfoTile({
  icon,
  label,
  value,
}: {
  icon: "mail" | "employees";
  label: string;
  value: string;
}) {
  return (
    <div className="min-w-0 rounded-xl border border-line bg-paper-sunken px-3.5 py-2.5">
      <p className="flex items-center gap-1.5 text-[0.68rem] font-semibold uppercase tracking-wider text-ink-faint">
        <Icon name={icon} className="h-3.5 w-3.5" />
        {label}
      </p>
      <p className="mt-1 truncate text-[0.82rem] font-medium">{value}</p>
    </div>
  );
}
