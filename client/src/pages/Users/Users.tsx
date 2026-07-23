import { useState } from "react";
import { Button } from "../../components/ui/Button";
import { Icon } from "../../components/ui/Icon";
import { UsersPanel } from "./UsersPanel";
import { MatrixPanel } from "./MatrixPanel";
import { SystemPanel } from "./SystemPanel";
import { AddUserModal } from "./AddUserModal";
import { initialUsers, type User } from "./data";

type Tab = "users" | "matrix" | "system";

const tabs: { id: Tab; label: string }[] = [
  { id: "users", label: "Users" },
  { id: "matrix", label: "Permission matrix" },
  { id: "system", label: "System settings" },
];

export default function Users() {
  const [tab, setTab] = useState<Tab>("users");
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [adding, setAdding] = useState(false);
  const [preview, setPreview] = useState<User | null>(null);

  const addUser = (u: User) => {
    setUsers((prev) => [u, ...prev]);
    setAdding(false);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* preview banner — "View as user" (§16) */}
      {preview && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-jade-500 bg-jade-100 px-4 py-3">
          <span className="flex items-center gap-2.5 text-[0.85rem] text-jade-800">
            <Icon name="eye" className="h-4.5 w-4.5 shrink-0" />
            Viewing as <b>{preview.name}</b> · {preview.role} · {preview.scope}. This is a read-only preview of their access.
          </span>
          <Button variant="ghost" size="sm" icon="close" onClick={() => setPreview(null)}>
            Exit preview
          </Button>
        </div>
      )}

      {/* head */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-display text-[0.82rem] font-medium italic text-gold-600">Administration</p>
          <h2 className="mt-0.5 font-display text-[1.6rem] font-bold">Users &amp; system settings</h2>
          <p className="mt-0.5 text-[0.85rem] text-ink-soft">
            Control who can see and change each part of the platform.
          </p>
        </div>
        {tab === "users" && (
          <Button variant="primary" size="md" icon="plus" onClick={() => setAdding(true)}>
            Add user
          </Button>
        )}
      </div>

      {/* tabs */}
      <div className="thin-scroll -mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`whitespace-nowrap rounded-full border px-3.5 py-1.5 text-[0.82rem] font-semibold transition-colors ${
              tab === t.id
                ? "border-jade-500 bg-jade-100 text-jade-700"
                : "border-line bg-paper-raised text-ink-soft hover:bg-paper-sunken"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* panel */}
      {tab === "users" && <UsersPanel users={users} onPreview={setPreview} />}
      {tab === "matrix" && <MatrixPanel />}
      {tab === "system" && <SystemPanel />}

      {adding && <AddUserModal onClose={() => setAdding(false)} onAdd={addUser} />}
    </div>
  );
}
