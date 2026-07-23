import { useEffect, useState } from "react";
import { Button } from "../../components/ui/Button";
import { Icon } from "../../components/ui/Icon";
import { financeCompanies, permRoles, type User } from "./data";

interface AddUserProps {
  onClose: () => void;
  onAdd: (user: User) => void;
}

const fieldClass =
  "w-full rounded-md border border-line bg-paper-sunken px-3 py-2.5 text-[0.86rem] text-ink placeholder:text-ink-faint focus:border-jade-500 focus:outline-none";
const labelClass =
  "mb-1.5 block text-[0.74rem] font-semibold uppercase tracking-[0.06em] text-ink-faint";

const initials = (name: string) =>
  name.trim().split(/\s+/).slice(0, 2).map((w) => w[0]?.toUpperCase() ?? "").join("") || "NU";

export function AddUserModal({ onClose, onAdd }: AddUserProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<string>(permRoles[4]);
  const [scope, setScope] = useState<string>("");

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const canAdd = name.trim() !== "" && email.trim() !== "";

  const add = () => {
    const scopeName = scope ? financeCompanies.find((c) => c.id === scope)?.name ?? "All companies" : "All companies";
    onAdd({
      id: `user-${Date.now()}`,
      name: name.trim(),
      initials: initials(name),
      color: "#227450",
      role,
      scope: scopeName,
      lastLogin: "Invite sent",
      status: { tone: "info", label: "Invited" },
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <button aria-label="Close" onClick={onClose} className="absolute inset-0 bg-jade-950/45 backdrop-blur-sm" />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Add user"
        className="relative flex max-h-[92vh] w-full max-w-xl flex-col overflow-hidden rounded-t-2xl border border-line bg-paper-raised shadow-(--shadow-lg) sm:rounded-2xl"
      >
        <div className="flex items-center justify-between gap-3 border-b border-line-soft px-5 py-4">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-jade-100 text-jade-600">
              <Icon name="users" className="h-4.5 w-4.5" strokeWidth={1.7} />
            </span>
            <div>
              <p className="font-display text-[0.78rem] font-medium italic text-gold-600">Administration</p>
              <h2 className="font-display text-[1.15rem] font-bold leading-tight">Add user</h2>
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
                <label className={labelClass} htmlFor="u-name">Full name</label>
                <input id="u-name" className={fieldClass} placeholder="e.g. Priya Nair" value={name} onChange={(e) => setName(e.target.value)} autoFocus />
              </div>
              <div>
                <label className={labelClass} htmlFor="u-email">Work email</label>
                <input id="u-email" type="email" className={fieldClass} placeholder="name@company.com" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={labelClass} htmlFor="u-role">Role</label>
                <select id="u-role" className={fieldClass} value={role} onChange={(e) => setRole(e.target.value)}>
                  {permRoles.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass} htmlFor="u-scope">Company scope</label>
                <select id="u-scope" className={fieldClass} value={scope} onChange={(e) => setScope(e.target.value)}>
                  <option value="">All companies</option>
                  {financeCompanies.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <p className="flex items-start gap-2 rounded-lg bg-paper-sunken px-3.5 py-2.5 text-[0.78rem] text-ink-soft">
              <Icon name="shield-check" className="mt-0.5 h-4 w-4 shrink-0 text-jade-600" />
              The user inherits their role's default access. Fine-tune it in the permission matrix, then use “View as
              user” to confirm before activation.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2.5 border-t border-line-soft px-5 py-3.5">
          <Button variant="ghost" size="md" onClick={onClose}>Cancel</Button>
          <Button variant="primary" size="md" icon="mail" disabled={!canAdd} onClick={add}>
            Send invite
          </Button>
        </div>
      </div>
    </div>
  );
}
