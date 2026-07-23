import { Card } from "../../components/ui/Card";
import { Pill } from "../../components/ui/Pill";
import { Button } from "../../components/ui/Button";
import type { User } from "./data";

export function UsersPanel({ users, onPreview }: { users: User[]; onPreview: (u: User) => void }) {
  return (
    <Card>
      <div className="thin-scroll overflow-x-auto">
        <table className="w-full text-[0.85rem]">
          <thead>
            <tr className="border-b border-line text-left">
              {["User", "Role", "Company scope", "Last login", "Status", ""].map((h, i) => (
                <th
                  key={h || "act"}
                  className={`whitespace-nowrap px-4 py-2.5 text-[0.7rem] font-bold uppercase tracking-wider text-ink-faint ${i === 5 ? "text-right" : ""}`}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b border-line-soft last:border-0 hover:bg-paper-sunken">
                <td className="px-4 py-3">
                  <span className="flex items-center gap-2.5 font-semibold">
                    <span
                      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[0.66rem] font-bold text-white"
                      style={{ backgroundColor: u.color }}
                    >
                      {u.initials}
                    </span>
                    {u.name}
                  </span>
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-ink-soft">{u.role}</td>
                <td className="whitespace-nowrap px-4 py-3 text-ink-soft">{u.scope}</td>
                <td className="tnum whitespace-nowrap px-4 py-3 text-ink-faint">{u.lastLogin}</td>
                <td className="px-4 py-3">
                  <Pill tone={u.status.tone}>{u.status.label}</Pill>
                </td>
                <td className="px-4 py-3 text-right">
                  <Button variant="ghost" size="sm" icon="eye" onClick={() => onPreview(u)}>
                    View as user
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
