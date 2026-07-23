import { useEffect, useState } from "react";
import { Button } from "../../components/ui/Button";
import { Icon } from "../../components/ui/Icon";
import { stages, type Company, type StageId } from "./data";

/** The seven guided-setup steps (spec §3 — "Add a new company"). */
const steps = [
  { title: "Company basics", hint: "Name, code and sector" },
  { title: "Portfolio stage", hint: "Stage & Jadeite ownership" },
  { title: "Departments", hint: "Workspace tabs to enable" },
  { title: "Financial basis", hint: "Currency & reporting cadence" },
  { title: "People & access", hint: "Invite admins and roles" },
  { title: "Integrations", hint: "Connect data sources" },
  { title: "Review & create", hint: "Confirm and add company" },
] as const;

const departments = [
  "Overview",
  "Financials",
  "E-Commerce",
  "Employees & KPIs",
  "Marketing",
  "Operations",
];

const dataSources = ["Shopify", "Meta Ads", "Google Ads", "TikTok Ads"];

interface AddCompanyModalProps {
  onClose: () => void;
  onCreate: (company: Company) => void;
}

const fieldClass =
  "w-full rounded-md border border-line bg-paper-sunken px-3 py-2.5 text-[0.86rem] text-ink placeholder:text-ink-faint focus:border-jade-500 focus:outline-none";
const labelClass =
  "mb-1.5 block text-[0.74rem] font-semibold uppercase tracking-[0.06em] text-ink-faint";

export function AddCompanyModal({ onClose, onCreate }: AddCompanyModalProps) {
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [sector, setSector] = useState("");
  const [stage, setStage] = useState<StageId>("rnd");
  const [ownership, setOwnership] = useState(100);
  const [depts, setDepts] = useState<string[]>(["Overview", "Financials"]);
  const [currency, setCurrency] = useState("USD");
  const [sources, setSources] = useState<string[]>([]);

  // Close on Escape and lock background scroll while open.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const canAdvance = step !== 0 || (name.trim() !== "" && code.trim() !== "");
  const isLast = step === steps.length - 1;

  const toggle = (list: string[], set: (v: string[]) => void, v: string) =>
    set(list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);

  const handleCreate = () => {
    const initials =
      code.trim().toUpperCase().slice(0, 2) ||
      name.trim().slice(0, 2).toUpperCase() ||
      "NC";
    onCreate({
      id: `${name.trim().toLowerCase().replace(/\s+/g, "-") || "company"}-${Date.now()}`,
      code: initials,
      name: name.trim() || "New company",
      color: "#227450",
      sector: sector.trim() || "Uncategorised",
      stage,
      ownership,
      status: { tone: "info", label: "Setting up" },
      revenue: stage === "pipeline" ? null : 0,
      margin: null,
      employees: 0,
      updated: "Just now",
      diligence:
        stage === "pipeline"
          ? { label: "New opportunity — screening", progress: 5 }
          : undefined,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      {/* backdrop */}
      <button
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-jade-950/45 backdrop-blur-sm"
      />

      {/* dialog */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Add a new company"
        className="relative flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-t-2xl border border-line bg-paper-raised shadow-(--shadow-lg) sm:rounded-2xl"
      >
        {/* header */}
        <div className="flex items-center justify-between gap-3 border-b border-line-soft px-5 py-4">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-jade-100 text-jade-600">
              <Icon name="building" className="h-4.75 w-4.75" strokeWidth={1.7} />
            </span>
            <div>
              <p className="font-display text-[0.78rem] font-medium italic text-gold-600">
                Guided setup
              </p>
              <h2 className="font-display text-[1.15rem] font-bold leading-tight">
                Add a new company
              </h2>
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

        <div className="grid min-h-0 flex-1 sm:grid-cols-[13rem_1fr]">
          {/* stepper rail */}
          <ol className="thin-scroll hidden overflow-y-auto border-r border-line-soft bg-paper-sunken/40 p-3 sm:block">
            {steps.map((s, i) => {
              const done = i < step;
              const active = i === step;
              return (
                <li key={s.title}>
                  <button
                    onClick={() => i <= step && setStep(i)}
                    disabled={i > step}
                    className={`flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-left transition-colors ${
                      active ? "bg-jade-100" : "hover:bg-paper-sunken"
                    } disabled:cursor-default disabled:opacity-55`}
                  >
                    <span
                      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[0.72rem] font-bold ${
                        done
                          ? "bg-jade-600 text-white"
                          : active
                            ? "bg-jade-600 text-white"
                            : "border border-line bg-paper-raised text-ink-faint"
                      }`}
                    >
                      {done ? <Icon name="check" className="h-3.5 w-3.5" strokeWidth={2.4} /> : i + 1}
                    </span>
                    <span className="min-w-0">
                      <span
                        className={`block truncate text-[0.82rem] font-semibold ${
                          active ? "text-jade-700" : "text-ink"
                        }`}
                      >
                        {s.title}
                      </span>
                      <span className="block truncate text-[0.7rem] text-ink-faint">
                        {s.hint}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>

          {/* step body */}
          <div className="thin-scroll min-h-0 overflow-y-auto p-5">
            {/* mobile step indicator */}
            <p className="mb-4 text-[0.74rem] font-semibold uppercase tracking-[0.06em] text-ink-faint sm:hidden">
              Step {step + 1} of {steps.length} · {steps[step].title}
            </p>

            {step === 0 && (
              <div className="flex flex-col gap-4">
                <div className="grid gap-4 sm:grid-cols-[1fr_7rem]">
                  <div>
                    <label className={labelClass} htmlFor="c-name">
                      Company name
                    </label>
                    <input
                      id="c-name"
                      className={fieldClass}
                      placeholder="e.g. Verdant Foods"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      autoFocus
                    />
                  </div>
                  <div>
                    <label className={labelClass} htmlFor="c-code">
                      Code
                    </label>
                    <input
                      id="c-code"
                      className={`${fieldClass} uppercase`}
                      placeholder="VF"
                      maxLength={2}
                      value={code}
                      onChange={(e) => setCode(e.target.value.toUpperCase())}
                    />
                  </div>
                </div>
                <div>
                  <label className={labelClass} htmlFor="c-sector">
                    Sector
                  </label>
                  <input
                    id="c-sector"
                    className={fieldClass}
                    placeholder="e.g. Plant-based · Beverages · Skincare"
                    value={sector}
                    onChange={(e) => setSector(e.target.value)}
                  />
                </div>
                <div>
                  <label className={labelClass}>Logo</label>
                  <div className="flex h-24 items-center justify-center rounded-md border border-dashed border-line bg-paper-sunken text-ink-faint">
                    <span className="flex items-center gap-2 text-[0.82rem]">
                      <Icon name="upload" className="h-4.25 w-4.25" />
                      Drop a logo or click to upload
                    </span>
                  </div>
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="flex flex-col gap-5">
                <div>
                  <p className={labelClass}>Portfolio stage</p>
                  <div className="grid gap-2.5 sm:grid-cols-2">
                    {stages.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => setStage(s.id)}
                        className={`rounded-xl border px-3.5 py-3 text-left transition-colors ${
                          stage === s.id
                            ? "border-jade-500 bg-jade-50"
                            : "border-line bg-paper-raised hover:bg-paper-sunken"
                        }`}
                      >
                        <span className="flex items-center justify-between">
                          <span className="text-[0.88rem] font-semibold">{s.label}</span>
                          {stage === s.id && (
                            <Icon name="check" className="h-4 w-4 text-jade-600" strokeWidth={2.4} />
                          )}
                        </span>
                        <span className="mt-1 block text-[0.74rem] text-ink-soft">{s.blurb}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className={labelClass} htmlFor="c-own">
                    Jadeite ownership · <span className="tnum text-jade-600">{ownership}%</span>
                  </label>
                  <input
                    id="c-own"
                    type="range"
                    min={0}
                    max={100}
                    step={5}
                    value={ownership}
                    onChange={(e) => setOwnership(Number(e.target.value))}
                    className="w-full accent-jade-600"
                  />
                </div>
              </div>
            )}

            {step === 2 && (
              <div>
                <p className="mb-1 text-[0.9rem] font-semibold">Department workspace tabs</p>
                <p className="mb-4 text-[0.8rem] text-ink-soft">
                  Choose the dashboards that appear inside this company's workspace. You can
                  change these later.
                </p>
                <div className="grid gap-2.5 sm:grid-cols-2">
                  {departments.map((d) => {
                    const on = depts.includes(d);
                    return (
                      <button
                        key={d}
                        onClick={() => toggle(depts, setDepts, d)}
                        className={`flex items-center gap-2.5 rounded-xl border px-3.5 py-3 text-left text-[0.85rem] font-medium transition-colors ${
                          on
                            ? "border-jade-500 bg-jade-50"
                            : "border-line bg-paper-raised hover:bg-paper-sunken"
                        }`}
                      >
                        <span
                          className={`flex h-4.5 w-4.5 items-center justify-center rounded-sm border ${
                            on ? "border-jade-600 bg-jade-600 text-white" : "border-line"
                          }`}
                        >
                          {on && <Icon name="check" className="h-3 w-3" strokeWidth={2.6} />}
                        </span>
                        {d}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="flex flex-col gap-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className={labelClass} htmlFor="c-cur">
                      Reporting currency
                    </label>
                    <select
                      id="c-cur"
                      className={fieldClass}
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value)}
                    >
                      {["USD", "EUR", "GBP", "AED", "SAR"].map((c) => (
                        <option key={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass} htmlFor="c-fy">
                      Fiscal year start
                    </label>
                    <select id="c-fy" className={fieldClass} defaultValue="January">
                      {["January", "April", "July", "October"].map((m) => (
                        <option key={m}>{m}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="rounded-xl border border-line bg-paper-sunken px-4 py-3.5">
                  <p className="text-[0.82rem] font-semibold">Update frequency</p>
                  <p className="mt-1 text-[0.78rem] text-ink-soft">
                    Set by stage — <b>{stages.find((s) => s.id === stage)?.label}</b> companies
                    report{" "}
                    <b>
                      {stage === "active" || stage === "growth"
                        ? "monthly"
                        : stage === "rnd"
                          ? "quarterly"
                          : "on milestone"}
                    </b>
                    . This can be overridden per company later.
                  </p>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="flex flex-col gap-4">
                <div>
                  <label className={labelClass} htmlFor="c-invite">
                    Invite admins (comma-separated emails)
                  </label>
                  <input
                    id="c-invite"
                    className={fieldClass}
                    placeholder="name@company.com, name2@company.com"
                  />
                </div>
                <div className="rounded-xl border border-line bg-paper-sunken px-4 py-3.5 text-[0.8rem] text-ink-soft">
                  Invited people receive a role-based homepage. Granular access (6 permission
                  levels) is configured under <b>Users &amp; Settings</b> once the company is
                  created. AI can recommend, but cannot approve, access changes.
                </div>
              </div>
            )}

            {step === 5 && (
              <div>
                <p className="mb-1 text-[0.9rem] font-semibold">Connect data sources</p>
                <p className="mb-4 text-[0.8rem] text-ink-soft">
                  Optional now — connectors can be added later from the Integration Center.
                </p>
                <div className="grid gap-2.5 sm:grid-cols-2">
                  {dataSources.map((d) => {
                    const on = sources.includes(d);
                    return (
                      <button
                        key={d}
                        onClick={() => toggle(sources, setSources, d)}
                        className={`flex items-center justify-between rounded-xl border px-3.5 py-3 text-left text-[0.85rem] font-medium transition-colors ${
                          on
                            ? "border-jade-500 bg-jade-50"
                            : "border-line bg-paper-raised hover:bg-paper-sunken"
                        }`}
                      >
                        <span className="flex items-center gap-2.5">
                          <Icon name="integrations" className="h-4.25 w-4.25 text-jade-600" />
                          {d}
                        </span>
                        <span className="text-[0.72rem] font-semibold text-ink-faint">
                          {on ? "Selected" : "Connect"}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {step === 6 && (
              <div className="flex flex-col gap-3">
                <p className="text-[0.9rem] font-semibold">Review</p>
                <dl className="overflow-hidden rounded-xl border border-line">
                  {[
                    ["Company", name.trim() || "—"],
                    ["Code", code.trim().toUpperCase() || "—"],
                    ["Sector", sector.trim() || "—"],
                    ["Stage", stages.find((s) => s.id === stage)?.label ?? "—"],
                    ["Jadeite ownership", `${ownership}%`],
                    ["Departments", depts.join(", ") || "None"],
                    ["Currency", currency],
                    ["Integrations", sources.join(", ") || "None yet"],
                  ].map(([k, v], i) => (
                    <div
                      key={k}
                      className={`flex items-start justify-between gap-4 px-4 py-2.5 text-[0.84rem] ${
                        i % 2 ? "bg-paper-raised" : "bg-paper-sunken/50"
                      }`}
                    >
                      <dt className="text-ink-soft">{k}</dt>
                      <dd className="text-right font-semibold">{v}</dd>
                    </div>
                  ))}
                </dl>
                <p className="flex items-start gap-2 text-[0.78rem] text-ink-soft">
                  <Icon name="shield-check" className="mt-0.5 h-4 w-4 shrink-0 text-jade-600" />
                  Creating the company records this action in Audit History. It starts in a
                  “Setting up” state until its first data is entered or synced.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* footer */}
        <div className="flex items-center justify-between gap-3 border-t border-line-soft px-5 py-3.5">
          <span className="text-[0.76rem] text-ink-faint">
            Step {step + 1} of {steps.length}
          </span>
          <div className="flex gap-2.5">
            <Button
              variant="ghost"
              size="md"
              onClick={() => (step === 0 ? onClose() : setStep((s) => s - 1))}
            >
              {step === 0 ? "Cancel" : "Back"}
            </Button>
            {isLast ? (
              <Button variant="primary" size="md" icon="check" onClick={handleCreate}>
                Create company
              </Button>
            ) : (
              <Button
                variant="primary"
                size="md"
                icon="chevron-right"
                disabled={!canAdvance}
                onClick={() => setStep((s) => s + 1)}
              >
                Continue
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
