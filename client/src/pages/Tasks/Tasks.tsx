import { useMemo, useState } from "react";
import { Card } from "../../components/ui/Card";
import { StatCard } from "../../components/ui/StatCard";
import { Pill } from "../../components/ui/Pill";
import { Button } from "../../components/ui/Button";
import { Icon } from "../../components/ui/Icon";
import { CreateTaskModal } from "./CreateTaskModal";
import {
  financeCompanies,
  initialTasks,
  matchesFilter,
  priorityMeta,
  sourceMeta,
  taskCompany,
  taskFilters,
  taskStatusMeta,
  type Task,
  type TaskFilter,
} from "./data";

export default function Tasks() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [filter, setFilter] = useState<TaskFilter["id"]>("open");
  const [companyId, setCompanyId] = useState<string>("");
  const [creating, setCreating] = useState(false);

  const summary = useMemo(
    () => ({
      open: tasks.filter((t) => t.status !== "done").length,
      overdue: tasks.filter((t) => t.status === "overdue").length,
      inProgress: tasks.filter((t) => t.status === "in-progress").length,
      done: tasks.filter((t) => t.status === "done").length,
    }),
    [tasks],
  );

  const visible = tasks.filter(
    (t) => matchesFilter(t, filter) && (companyId === "" || t.companyId === companyId),
  );

  const toggleDone = (id: string) =>
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, status: t.status === "done" ? "in-progress" : "done" } : t,
      ),
    );

  const addTask = (task: Task) => {
    setTasks((prev) => [task, ...prev]);
    setCreating(false);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* head */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-display text-[0.82rem] font-medium italic text-gold-600">Execution</p>
          <h2 className="mt-0.5 font-display text-[1.6rem] font-bold">Tasks</h2>
          <p className="mt-0.5 text-[0.85rem] text-ink-soft">
            Central action tracker across every company — turn information into accountable execution.
          </p>
        </div>
        <Button variant="primary" size="md" icon="plus" onClick={() => setCreating(true)}>
          Create task
        </Button>
      </div>

      {/* summary */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Open tasks" value={`${summary.open}`} caption="Not yet done" />
        <StatCard
          label="Overdue"
          value={`${summary.overdue}`}
          delta={summary.overdue ? { direction: "down", text: "past due date" } : undefined}
          caption={summary.overdue ? undefined : "Nothing overdue"}
        />
        <StatCard label="In progress" value={`${summary.inProgress}`} caption="Being worked on" />
        <StatCard label="Completed" value={`${summary.done}`} caption="This period" />
      </div>

      {/* filters */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="thin-scroll -mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1">
          {taskFilters.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`whitespace-nowrap rounded-full border px-3.5 py-1.5 text-[0.82rem] font-semibold transition-colors ${
                filter === f.id
                  ? "border-jade-500 bg-jade-100 text-jade-700"
                  : "border-line bg-paper-raised text-ink-soft hover:bg-paper-sunken"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <select
          value={companyId}
          onChange={(e) => setCompanyId(e.target.value)}
          aria-label="Filter by company"
          className="rounded-md border border-line bg-paper-raised px-3 py-1.5 text-[0.82rem] font-medium text-ink focus:border-jade-500 focus:outline-none"
        >
          <option value="">All companies</option>
          {financeCompanies.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      {/* table */}
      <Card>
        <div className="thin-scroll overflow-x-auto">
          <table className="w-full text-[0.85rem]">
            <thead>
              <tr className="border-b border-line text-left">
                <th className="w-10 px-4 py-2.5" />
                {["Task", "Company", "Owner", "Due", "Priority", "Status"].map((h, i) => (
                  <th
                    key={h}
                    className={`whitespace-nowrap px-4 py-2.5 text-[0.7rem] font-bold uppercase tracking-wider text-ink-faint ${i >= 4 ? "text-right" : ""}`}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visible.map((t) => {
                const co = taskCompany(t.companyId);
                const done = t.status === "done";
                const src = sourceMeta[t.source];
                return (
                  <tr key={t.id} className="border-b border-line-soft last:border-0 hover:bg-paper-sunken">
                    <td className="px-4 py-3">
                      <button
                        onClick={() => toggleDone(t.id)}
                        aria-label={done ? "Mark not done" : "Mark done"}
                        className={`flex h-5 w-5 items-center justify-center rounded-md border transition-colors ${
                          done ? "border-jade-600 bg-jade-600 text-white" : "border-line hover:border-jade-500"
                        }`}
                      >
                        {done && <Icon name="check" className="h-3.5 w-3.5" strokeWidth={2.6} />}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className={`flex items-center gap-2 font-semibold ${done ? "text-ink-faint line-through" : ""}`}>
                        {t.title}
                        {t.source !== "manual" && (
                          <span className="inline-flex items-center gap-1 rounded-md bg-jade-100 px-1.5 py-0.5 text-[0.64rem] font-bold text-jade-600">
                            <Icon name={src.icon} className="h-3 w-3" /> {src.label}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="flex items-center gap-2 whitespace-nowrap text-ink-soft">
                        <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: co.color }} />
                        {co.name}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-ink-soft">{t.owner}</td>
                    <td className="tnum whitespace-nowrap px-4 py-3 text-right text-ink-soft">{t.due}</td>
                    <td className="px-4 py-3 text-right">
                      <span className="inline-flex justify-end">
                        <Pill tone={priorityMeta[t.priority].tone}>{priorityMeta[t.priority].label}</Pill>
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="inline-flex justify-end">
                        <Pill tone={done ? taskStatusMeta.done.tone : taskStatusMeta[t.status].tone}>
                          {taskStatusMeta[t.status].label}
                        </Pill>
                      </span>
                    </td>
                  </tr>
                );
              })}
              {visible.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-[0.85rem] text-ink-faint">
                    No tasks match this filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {creating && <CreateTaskModal onClose={() => setCreating(false)} onCreate={addTask} />}
    </div>
  );
}
