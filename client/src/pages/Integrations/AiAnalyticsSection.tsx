import { useState } from "react";
import { useNavigate } from "react-router";
import { Card } from "../../components/ui/Card";
import { StatCard } from "../../components/ui/StatCard";
import { Pill } from "../../components/ui/Pill";
import { Button } from "../../components/ui/Button";
import { Icon } from "../../components/ui/Icon";
import { aiFindings, intCompanies, safeguards, severityMeta, type AiFinding } from "./data";

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <span className="inline-flex items-baseline gap-1 whitespace-nowrap">
      <span className="text-ink-faint">{label}</span>
      <span className="font-semibold text-ink-soft">{value}</span>
    </span>
  );
}

function FindingCard({
  finding,
  converted,
  onConvert,
}: {
  finding: AiFinding;
  converted: boolean;
  onConvert: () => void;
}) {
  const co = intCompanies.find((c) => c.id === finding.companyId);
  const sev = severityMeta[finding.severity];
  return (
    <div className="border-b border-line-soft p-5 last:border-0">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: co?.color ?? "#999" }} />
          <h4 className="font-display text-[0.98rem] font-bold">{finding.title}</h4>
        </div>
        <Pill tone={sev.tone}>{sev.label}</Pill>
      </div>

      <p className="mt-2 text-[0.85rem] leading-relaxed text-ink-soft">{finding.insight}</p>

      {/* evidence line — required on every AI answer (12C.6) */}
      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[0.74rem]">
        <Meta label="Company:" value={co?.name ?? finding.companyId} />
        <Meta label="Period:" value={finding.period} />
        <span className="inline-flex items-center gap-1.5">
          <span className="text-ink-faint">Sources:</span>
          {finding.sources.map((s) => (
            <span key={s} className="rounded-md bg-paper-sunken px-1.5 py-0.5 text-[0.7rem] font-semibold text-ink-soft">
              {s}
            </span>
          ))}
        </span>
        <Meta label="Refreshed" value={finding.refreshed} />
      </div>

      <p className="mt-2.5 flex items-start gap-1.5 text-[0.76rem] text-ink-faint">
        <Icon name="flag" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-warn" />
        <span>
          <span className="font-semibold text-ink-soft">Limitation:</span> {finding.limitation}
        </span>
      </p>

      <div className="mt-3.5 flex flex-wrap items-center gap-2">
        {converted ? (
          <Pill tone="good">
            <Icon name="check" className="h-3 w-3" strokeWidth={2.6} /> Task created
          </Pill>
        ) : (
          <Button variant="soft" size="sm" icon="tasks" onClick={onConvert}>
            Convert to task
          </Button>
        )}
        <Button variant="ghost" size="sm" icon="external">
          Open supporting data
        </Button>
      </div>
    </div>
  );
}

export function AiAnalyticsSection({ companyId }: { companyId: string | null }) {
  const navigate = useNavigate();
  const [converted, setConverted] = useState<Set<string>>(new Set());
  const findings = companyId ? aiFindings.filter((f) => f.companyId === companyId) : aiFindings;

  const convert = (id: string) =>
    setConverted((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="True Profit waterfall" value="CM1 → CM5" caption="Restricted · Executive, Finance, Marketing" />
        <StatCard label="Anomalies flagged this week" value={`${findings.length}`} caption="Each convertible to a task" />
        <StatCard label="Data governance" value="1 def / metric" caption="Source-of-truth mapped per data area" />
      </div>

      {/* findings */}
      <Card>
        <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-line-soft px-5 py-4">
          <h3 className="font-display text-[1.02rem] font-bold">AI Analytics Center</h3>
          <span className="text-[0.76rem] text-ink-faint">Read-only · role-aware · sources cited on every answer</span>
        </div>
        {findings.length === 0 ? (
          <p className="px-5 py-8 text-center text-[0.85rem] text-ink-faint">No findings for this company this period.</p>
        ) : (
          findings.map((f) => (
            <FindingCard key={f.id} finding={f} converted={converted.has(f.id)} onConvert={() => convert(f.id)} />
          ))
        )}
      </Card>

      {/* conversational hand-off to the AI Assistant */}
      <Card className="flex flex-wrap items-center justify-between gap-3 p-5">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-jade-100 text-jade-600">
            <Icon name="sparkle" className="h-4.5 w-4.5" />
          </span>
          <div>
            <p className="text-[0.9rem] font-semibold">Ask a management question</p>
            <p className="text-[0.78rem] text-ink-soft">
              "Why did sales fall?", "Which company needs attention?", "What should we do next?"
            </p>
          </div>
        </div>
        <Button variant="primary" size="md" icon="ai" onClick={() => navigate("/ai")}>
          Open AI Assistant
        </Button>
      </Card>

      {/* controls & safeguards (12C.6) */}
      <Card>
        <div className="flex items-center gap-2 border-b border-line-soft px-5 py-4">
          <Icon name="shield-check" className="h-4.5 w-4.5 text-jade-600" />
          <h3 className="font-display text-[1.02rem] font-bold">AI controls &amp; safeguards</h3>
        </div>
        <div className="grid gap-px bg-line-soft sm:grid-cols-2 lg:grid-cols-3">
          {safeguards.map((s) => (
            <div key={s.title} className="bg-paper-raised p-5">
              <div className="flex items-center gap-2">
                <Icon name={s.icon} className="h-4.25 w-4.25 text-jade-600" />
                <p className="text-[0.86rem] font-bold">{s.title}</p>
              </div>
              <p className="mt-1.5 text-[0.79rem] leading-relaxed text-ink-soft">{s.body}</p>
            </div>
          ))}
        </div>
      </Card>
    </>
  );
}
