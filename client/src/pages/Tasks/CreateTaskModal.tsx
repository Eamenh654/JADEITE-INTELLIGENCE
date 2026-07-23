import { useEffect, useState } from "react";
import { Button } from "../../components/ui/Button";
import { Icon } from "../../components/ui/Icon";
import { financeCompanies, priorityMeta, type Priority, type Task } from "./data";

interface CreateTaskProps {
  onClose: () => void;
  onCreate: (task: Task) => void;
}

const fieldClass =
  "w-full rounded-md border border-line bg-paper-sunken px-3 py-2.5 text-[0.86rem] text-ink placeholder:text-ink-faint focus:border-jade-500 focus:outline-none";
const labelClass =
  "mb-1.5 block text-[0.74rem] font-semibold uppercase tracking-[0.06em] text-ink-faint";

const priorities: Priority[] = ["high", "medium", "low"];

export function CreateTaskModal({ onClose, onCreate }: CreateTaskProps) {
  const [title, setTitle] = useState("");
  const [companyId, setCompanyId] = useState<string>("");
  const [owner, setOwner] = useState("");
  const [due, setDue] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const canCreate = title.trim() !== "";

  const create = () => {
    onCreate({
      id: `task-${Date.now()}`,
      title: title.trim(),
      companyId: companyId || null,
      owner: owner.trim() || "Unassigned",
      due: due.trim() || "No date",
      priority,
      status: "not-started",
      source: "manual",
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <button aria-label="Close" onClick={onClose} className="absolute inset-0 bg-jade-950/45 backdrop-blur-sm" />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Create task"
        className="relative flex max-h-[92vh] w-full max-w-xl flex-col overflow-hidden rounded-t-2xl border border-line bg-paper-raised shadow-(--shadow-lg) sm:rounded-2xl"
      >
        <div className="flex items-center justify-between gap-3 border-b border-line-soft px-5 py-4">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-jade-100 text-jade-600">
              <Icon name="tasks" className="h-4.5 w-4.5" strokeWidth={1.7} />
            </span>
            <div>
              <p className="font-display text-[0.78rem] font-medium italic text-gold-600">Execution</p>
              <h2 className="font-display text-[1.15rem] font-bold leading-tight">Create task</h2>
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
            <div>
              <label className={labelClass} htmlFor="t-title">Task</label>
              <input id="t-title" className={fieldClass} placeholder="e.g. Reorder hero SKU" value={title} onChange={(e) => setTitle(e.target.value)} autoFocus />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={labelClass} htmlFor="t-company">Company</label>
                <select id="t-company" className={fieldClass} value={companyId} onChange={(e) => setCompanyId(e.target.value)}>
                  <option value="">All / portfolio</option>
                  {financeCompanies.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass} htmlFor="t-owner">Owner</label>
                <input id="t-owner" className={fieldClass} placeholder="e.g. N. Farrow" value={owner} onChange={(e) => setOwner(e.target.value)} />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={labelClass} htmlFor="t-due">Due date</label>
                <input id="t-due" className={fieldClass} placeholder="e.g. Jul 28, 2026" value={due} onChange={(e) => setDue(e.target.value)} />
              </div>
              <div>
                <p className={labelClass}>Priority</p>
                <div className="grid grid-cols-3 gap-2">
                  {priorities.map((p) => (
                    <button
                      key={p}
                      onClick={() => setPriority(p)}
                      className={`rounded-lg border px-1 py-2 text-[0.76rem] font-semibold capitalize transition-colors ${
                        priority === p
                          ? "border-jade-500 bg-jade-100 text-jade-700"
                          : "border-line bg-paper-raised text-ink-soft hover:bg-paper-sunken"
                      }`}
                    >
                      {priorityMeta[p].label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2.5 border-t border-line-soft px-5 py-3.5">
          <Button variant="ghost" size="md" onClick={onClose}>Cancel</Button>
          <Button variant="primary" size="md" icon="plus" disabled={!canCreate} onClick={create}>
            Create task
          </Button>
        </div>
      </div>
    </div>
  );
}
