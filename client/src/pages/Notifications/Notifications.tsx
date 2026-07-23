import { useMemo, useState } from "react";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Icon } from "../../components/ui/Icon";
import { categoryMeta, initialNotifs, notifFilters, type Notif } from "./data";

const toneBg: Record<string, string> = {
  info: "bg-info-bg text-info",
  warn: "bg-warn-bg text-warn",
  critical: "bg-critical-bg text-critical",
  neutral: "bg-paper-sunken text-ink-soft",
  good: "bg-good-bg text-good",
};

export default function Notifications() {
  const [notifs, setNotifs] = useState<Notif[]>(initialNotifs);
  const [filter, setFilter] = useState<(typeof notifFilters)[number]["id"]>("all");

  const unread = useMemo(() => notifs.filter((n) => !n.read).length, [notifs]);

  const visible = notifs.filter((n) =>
    filter === "all" ? true : filter === "unread" ? !n.read : n.category === filter,
  );

  const markRead = (id: string) =>
    setNotifs((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  const markAllRead = () => setNotifs((prev) => prev.map((n) => ({ ...n, read: true })));

  return (
    <div className="flex flex-col gap-6">
      {/* head */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-display text-[0.82rem] font-medium italic text-gold-600">Administration</p>
          <h2 className="mt-0.5 font-display text-[1.6rem] font-bold">
            Notifications
            {unread > 0 && (
              <span className="ml-2 align-middle rounded-full bg-jade-600 px-2 py-0.5 text-[0.72rem] font-bold text-white">
                {unread} new
              </span>
            )}
          </h2>
          <p className="mt-0.5 text-[0.85rem] text-ink-soft">
            KPI, bonus, financial, task, document and e-commerce alerts across the portfolio.
          </p>
        </div>
        <Button variant="ghost" size="md" icon="check" disabled={unread === 0} onClick={markAllRead}>
          Mark all read
        </Button>
      </div>

      {/* filters */}
      <div className="thin-scroll -mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1">
        {notifFilters.map((f) => (
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
            {f.id === "unread" && unread > 0 && <span className="ml-1.5 tnum text-ink-faint">{unread}</span>}
          </button>
        ))}
      </div>

      {/* feed */}
      <Card>
        <ul className="flex flex-col">
          {visible.map((n) => {
            const m = categoryMeta[n.category];
            return (
              <li
                key={n.id}
                className={`flex items-start gap-3 border-b border-line-soft px-5 py-4 last:border-0 ${n.read ? "" : "bg-jade-50/40"}`}
              >
                <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${toneBg[m.tone]}`}>
                  <Icon name={m.icon} className="h-4.5 w-4.5" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    {!n.read && <span className="h-2 w-2 shrink-0 rounded-full bg-jade-600" />}
                    <p className={`text-[0.88rem] ${n.read ? "font-semibold text-ink-soft" : "font-bold"}`}>{n.title}</p>
                  </div>
                  <p className="mt-0.5 text-[0.8rem] text-ink-soft">{n.detail}</p>
                  <p className="mt-1 text-[0.72rem] text-ink-faint">{m.label} · {n.time}</p>
                </div>
                {!n.read && (
                  <button
                    onClick={() => markRead(n.id)}
                    className="shrink-0 rounded-md border border-line px-2.5 py-1 text-[0.74rem] font-semibold text-ink-soft hover:bg-paper-sunken"
                  >
                    Mark read
                  </button>
                )}
              </li>
            );
          })}
          {visible.length === 0 && (
            <li className="px-5 py-12 text-center text-[0.85rem] text-ink-faint">You're all caught up.</li>
          )}
        </ul>
      </Card>
    </div>
  );
}
