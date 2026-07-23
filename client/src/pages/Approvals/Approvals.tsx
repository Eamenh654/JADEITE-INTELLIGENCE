import { useMemo, useState } from "react";
import { Card } from "../../components/ui/Card";
import { StatCard } from "../../components/ui/StatCard";
import { Pill, Badge } from "../../components/ui/Pill";
import { Button } from "../../components/ui/Button";
import { Icon } from "../../components/ui/Icon";
import {
  approvalCompany,
  approvalTypes,
  initialApprovals,
  outcomeTone,
  typeTone,
  type ApprovalType,
  type Outcome,
} from "./data";

export default function Approvals() {
  const [resolved, setResolved] = useState<Record<string, Outcome>>({});
  const [type, setType] = useState<ApprovalType | "All">("All");

  const resolve = (id: string, outcome: Outcome) =>
    setResolved((prev) => ({ ...prev, [id]: outcome }));

  const summary = useMemo(() => {
    const outcomes = Object.values(resolved);
    return {
      pending: initialApprovals.length - outcomes.length,
      approved: outcomes.filter((o) => o === "Approved").length,
      sentBack: outcomes.filter((o) => o !== "Approved").length,
    };
  }, [resolved]);

  const visible = initialApprovals.filter((a) => type === "All" || a.type === type);

  return (
    <div className="flex flex-col gap-6">
      {/* head */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-display text-[0.82rem] font-medium italic text-gold-600">Governance</p>
          <h2 className="mt-0.5 font-display text-[1.6rem] font-bold">Approvals</h2>
          <p className="mt-0.5 text-[0.85rem] text-ink-soft">
            One place for every pending management decision — KPIs, bonuses, financials, equity, documents and access.
          </p>
        </div>
      </div>

      {/* summary */}
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Pending decisions" value={`${summary.pending}`} caption="Awaiting your review" />
        <StatCard label="Approved" value={`${summary.approved}`} caption="This session" />
        <StatCard label="Sent back" value={`${summary.sentBack}`} caption="Changes, deferred or rejected" />
      </div>

      {/* type filter */}
      <div className="thin-scroll -mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1">
        {approvalTypes.map((t) => (
          <button
            key={t}
            onClick={() => setType(t)}
            className={`whitespace-nowrap rounded-full border px-3.5 py-1.5 text-[0.82rem] font-semibold transition-colors ${
              type === t
                ? "border-jade-500 bg-jade-100 text-jade-700"
                : "border-line bg-paper-raised text-ink-soft hover:bg-paper-sunken"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* table */}
      <Card>
        <div className="thin-scroll overflow-x-auto">
          <table className="w-full text-[0.85rem]">
            <thead>
              <tr className="border-b border-line text-left">
                {["Item", "Type", "Company", "Requested by", "Submitted", ""].map((h, i) => (
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
              {visible.map((a) => {
                const co = approvalCompany(a.companyId);
                const outcome = resolved[a.id];
                return (
                  <tr key={a.id} className="border-b border-line-soft last:border-0 hover:bg-paper-sunken">
                    <td className="px-4 py-3 font-semibold">{a.item}</td>
                    <td className="px-4 py-3">
                      <Badge tone={typeTone[a.type]}>{a.type}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <span className="flex items-center gap-2 whitespace-nowrap text-ink-soft">
                        <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: co.color }} />
                        {co.name}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-ink-soft">{a.requestedBy}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-ink-soft">{a.submitted}</td>
                    <td className="px-4 py-3">
                      {outcome ? (
                        <span className="flex justify-end">
                          <Pill tone={outcomeTone[outcome]}>{outcome}</Pill>
                        </span>
                      ) : (
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="sm" onClick={() => resolve(a.id, a.secondary)}>
                            {a.secondary === "Changes requested" ? "Request changes" : a.secondary === "Deferred" ? "Defer" : "Reject"}
                          </Button>
                          <Button variant="primary" size="sm" icon="check" onClick={() => resolve(a.id, "Approved")}>
                            Approve
                          </Button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
              {visible.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-[0.85rem] text-ink-faint">
                    No {type.toLowerCase()} approvals pending.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* AI-cannot-approve principle */}
      <p className="flex items-start gap-2 rounded-xl border border-line bg-paper-raised px-4 py-3 text-[0.8rem] text-ink-soft">
        <Icon name="shield-check" className="mt-0.5 h-4.25 w-4.25 shrink-0 text-jade-600" />
        Every decision here is made by an authorized person. AI can prepare a recommendation, cite the supporting data
        and open a request — but it can never approve a KPI, bonus, financial submission, equity change, document or
        access grant on its own.
      </p>
    </div>
  );
}
