import { Button } from "../../components/ui/Button";
import { Card, CardHead } from "../../components/ui/Card";
import { StatCard } from "../../components/ui/StatCard";
import { Pill, Badge } from "../../components/ui/Pill";
import { Icon } from "../../components/ui/Icon";
import { stats, companies, attention } from "./data";

const toneDot: Record<string, string> = {
  good: "bg-good",
  warn: "bg-warn",
  critical: "bg-critical",
  info: "bg-info",
  neutral: "bg-ink-faint",
};

export default function Dashboard() {
  return (
    <div className="flex flex-col gap-6">
      {/* Page head */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-display text-[0.82rem] font-medium italic text-gold-600">
            Portfolio overview
          </p>
          <h2 className="mt-0.5 font-display text-[1.6rem] font-bold">
            What needs your attention today
          </h2>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="ghost" size="sm">
            Full portfolio results
          </Button>
          <Button variant="soft" size="sm">
            Jadeite equity-adjusted
          </Button>
          <Button variant="primary" size="sm" icon="download">
            Export summary
          </Button>
        </div>
      </div>

      {/* Stat grid */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      {/* Two-column body */}
      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr] lg:items-start">
        {/* Company status table */}
        <Card>
          <CardHead
            title="Company status"
            meta="By portfolio stage"
            action={
              <Button variant="ghost" size="sm" icon="external">
                View all
              </Button>
            }
          />
          {/* Mobile: stacked cards (no horizontal scroll on small screens) */}
          <ul className="flex flex-col md:hidden">
            {companies.map((c) => (
              <li
                key={c.code}
                className="flex flex-col gap-2 border-b border-line-soft px-5 py-4 last:border-0"
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className="flex h-6.5 w-6.5 shrink-0 items-center justify-center rounded-lg font-display text-[0.62rem] font-bold text-white"
                    style={{ backgroundColor: c.color }}
                  >
                    {c.code}
                  </span>
                  <span className="min-w-0 flex-1 truncate font-semibold">{c.name}</span>
                  <Pill tone={c.status.tone}>{c.status.label}</Pill>
                </div>
                <p className="text-[0.8rem] text-ink-soft">{c.reason}</p>
                <div className="flex items-center justify-between gap-2">
                  <Badge>{c.stage}</Badge>
                  <span className="whitespace-nowrap text-[0.74rem] text-ink-faint">
                    {c.updated}
                  </span>
                </div>
              </li>
            ))}
          </ul>

          {/* Desktop: full table */}
          <div className="thin-scroll hidden overflow-x-auto md:block">
            <table className="w-full text-[0.85rem]">
              <thead>
                <tr className="border-b border-line text-left">
                  {["Company", "Stage", "Status", "Reason", "Updated"].map((h) => (
                    <th
                      key={h}
                      className="whitespace-nowrap px-4 py-2.5 text-[0.7rem] font-bold uppercase tracking-[0.06em] text-ink-faint last:text-right"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {companies.map((c) => (
                  <tr
                    key={c.code}
                    className="cursor-pointer border-b border-line-soft transition-colors last:border-0 hover:bg-paper-sunken"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <span
                          className="flex h-6.5 w-6.5 shrink-0 items-center justify-center rounded-lg font-display text-[0.62rem] font-bold text-white"
                          style={{ backgroundColor: c.color }}
                        >
                          {c.code}
                        </span>
                        <span className="font-semibold">{c.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge>{c.stage}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Pill tone={c.status.tone}>{c.status.label}</Pill>
                    </td>
                    <td className="px-4 py-3 text-ink-soft">{c.reason}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-right text-ink-soft">
                      {c.updated}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Right column */}
        <div className="flex flex-col gap-6">
          <Card>
            <CardHead title="Needs attention" meta="5 open" />
            <ul className="flex flex-col">
              {attention.map((a) => (
                <li
                  key={a.title}
                  className="flex gap-3 border-b border-line-soft px-5 py-3.5 last:border-0"
                >
                  <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${toneDot[a.tone]}`} />
                  <div className="min-w-0">
                    <p className="text-[0.83rem] font-semibold">{a.title}</p>
                    <p className="mt-0.5 text-[0.76rem] text-ink-soft">{a.meta}</p>
                  </div>
                </li>
              ))}
            </ul>
          </Card>

          {/* Quick actions */}
          <Card className="p-5">
            <h3 className="font-display text-[1.02rem] font-bold">Quick actions</h3>
            <div className="mt-3 grid grid-cols-2 gap-2.5">
              {(
                [
                  { icon: "plus", label: "Add company" },
                  { icon: "approvals", label: "Review approvals" },
                  { icon: "bonuses", label: "Run bonuses" },
                  { icon: "reports", label: "Build report" },
                ] as const
              ).map((q) => (
                <button
                  key={q.label}
                  className="flex items-center gap-2.5 rounded-xl border border-line bg-paper-raised px-3 py-3 text-left text-[0.83rem] font-semibold transition-colors hover:border-jade-500 hover:bg-jade-50"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-jade-100 text-jade-600">
                    <Icon name={q.icon} className="h-4.25 w-4.25" />
                  </span>
                  {q.label}
                </button>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
