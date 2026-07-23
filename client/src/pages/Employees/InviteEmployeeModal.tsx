import { useEffect, useState } from "react";
import { Button } from "../../components/ui/Button";
import { Icon } from "../../components/ui/Icon";
import {
  accessLevels,
  homepageFor,
  permsFrom,
  scopes,
  type Employee,
} from "./data";

interface InviteProps {
  onClose: () => void;
  onInvite: (employee: Employee) => void;
}

const fieldClass =
  "w-full rounded-md border border-line bg-paper-sunken px-3 py-2.5 text-[0.86rem] text-ink placeholder:text-ink-faint focus:border-jade-500 focus:outline-none";
const labelClass =
  "mb-1.5 block text-[0.74rem] font-semibold uppercase tracking-[0.06em] text-ink-faint";

const initials = (name: string) =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("") || "NE";

export function InviteEmployeeModal({ onClose, onInvite }: InviteProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState(scopes[1]?.code ?? "GRP");
  const [role, setRole] = useState("");
  const [department, setDepartment] = useState("");
  const [level, setLevel] = useState(2);
  const [ai, setAi] = useState(true);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const canSend = name.trim() !== "" && email.trim() !== "";

  const send = () => {
    onInvite({
      id: `${name.trim().toLowerCase().replace(/\s+/g, "-") || "employee"}-${Date.now()}`,
      name: name.trim(),
      initials: initials(name),
      color: "#227450",
      role: role.trim() || "Team member",
      companyCode: company,
      department: department.trim() || "General",
      level,
      status: "invited",
      lastActive: "Invite sent",
      email: email.trim(),
      aiAssistant: ai,
      permissions: permsFrom(level),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <button aria-label="Close" onClick={onClose} className="absolute inset-0 bg-jade-950/45 backdrop-blur-sm" />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Invite employee"
        className="relative flex max-h-[92vh] w-full max-w-xl flex-col overflow-hidden rounded-t-2xl border border-line bg-paper-raised shadow-(--shadow-lg) sm:rounded-2xl"
      >
        <div className="flex items-center justify-between gap-3 border-b border-line-soft px-5 py-4">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-jade-100 text-jade-600">
              <Icon name="mail" className="h-4.5 w-4.5" strokeWidth={1.7} />
            </span>
            <div>
              <p className="font-display text-[0.78rem] font-medium italic text-gold-600">People</p>
              <h2 className="font-display text-[1.15rem] font-bold leading-tight">Invite employee</h2>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="flex h-8.5 w-8.5 items-center justify-center rounded-[9px] border border-line text-ink-soft hover:bg-paper-sunken"
          >
            <Icon name="close" className="h-4.25 w-4.25" />
          </button>
        </div>

        <div className="thin-scroll min-h-0 flex-1 overflow-y-auto p-5">
          <div className="flex flex-col gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={labelClass} htmlFor="e-name">Full name</label>
                <input id="e-name" className={fieldClass} placeholder="e.g. Priya Nair" value={name} onChange={(ev) => setName(ev.target.value)} autoFocus />
              </div>
              <div>
                <label className={labelClass} htmlFor="e-email">Work email</label>
                <input id="e-email" type="email" className={fieldClass} placeholder="name@company.com" value={email} onChange={(ev) => setEmail(ev.target.value)} />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={labelClass} htmlFor="e-company">Company / scope</label>
                <select id="e-company" className={fieldClass} value={company} onChange={(ev) => setCompany(ev.target.value)}>
                  {scopes.map((s) => (
                    <option key={s.code} value={s.code}>{s.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass} htmlFor="e-dept">Department</label>
                <input id="e-dept" className={fieldClass} placeholder="e.g. Marketing" value={department} onChange={(ev) => setDepartment(ev.target.value)} />
              </div>
            </div>

            <div>
              <label className={labelClass} htmlFor="e-role">Role</label>
              <input id="e-role" className={fieldClass} placeholder="e.g. Growth Analyst" value={role} onChange={(ev) => setRole(ev.target.value)} />
            </div>

            {/* access level */}
            <div>
              <p className={labelClass}>Default access level</p>
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
                {accessLevels.map((l) => (
                  <button
                    key={l.id}
                    onClick={() => setLevel(l.id)}
                    title={l.desc}
                    className={`rounded-lg border px-1 py-2 text-[0.72rem] font-semibold transition-colors ${
                      level === l.id
                        ? "border-jade-500 bg-jade-100 text-jade-700"
                        : "border-line bg-paper-raised text-ink-soft hover:bg-paper-sunken"
                    }`}
                  >
                    {l.short}
                  </button>
                ))}
              </div>
              <p className="mt-2 text-[0.78rem] text-ink-soft">
                {accessLevels[level].desc} Lands on <b>{homepageFor(level)}</b>. Fine-tune each
                area after inviting.
              </p>
            </div>

            {/* AI assistant */}
            <label className="flex cursor-pointer items-center justify-between rounded-xl border border-line px-4 py-3">
              <span className="flex items-center gap-2.5">
                <Icon name="sparkle" className="h-4.5 w-4.5 text-jade-600" />
                <span>
                  <span className="block text-[0.86rem] font-semibold">Employee AI Assistant</span>
                  <span className="block text-[0.76rem] text-ink-soft">Scoped to this person's access</span>
                </span>
              </span>
              <input type="checkbox" checked={ai} onChange={(ev) => setAi(ev.target.checked)} className="h-4.5 w-4.5 accent-jade-600" />
            </label>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2.5 border-t border-line-soft px-5 py-3.5">
          <Button variant="ghost" size="md" onClick={onClose}>Cancel</Button>
          <Button variant="primary" size="md" icon="mail" disabled={!canSend} onClick={send}>
            Send invite
          </Button>
        </div>
      </div>
    </div>
  );
}
