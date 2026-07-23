import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { StatCard } from "../../components/ui/StatCard";
import { Pill, Badge } from "../../components/ui/Pill";
import { Icon } from "../../components/ui/Icon";
import { AddCompanyModal } from "./AddCompanyModal";
import {
  initialCompanies,
  stages,
  fmtUSD,
  type Company,
  type StageId,
} from "./data";

type View = "grid" | "list";
type Filter = StageId | "all";

export default function Companies() {
  const [companies, setCompanies] = useState<Company[]>(initialCompanies);
  const [view, setView] = useState<View>("grid");
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [showArchived, setShowArchived] = useState(false);
  const [addOpen, setAddOpen] = useState(false);

  const archive = (id: string) =>
    setCompanies((cs) => cs.map((c) => (c.id === id ? { ...c, archived: true } : c)));
  const restore = (id: string) =>
    setCompanies((cs) => cs.map((c) => (c.id === id ? { ...c, archived: false } : c)));
  const remove = (id: string) =>
    setCompanies((cs) => cs.filter((c) => c.id !== id));

  const matchesQuery = (c: Company) => {
    const q = query.trim().toLowerCase();
    return !q || c.name.toLowerCase().includes(q) || c.sector.toLowerCase().includes(q);
  };

  const live = companies.filter((c) => !c.archived && matchesQuery(c));
  const archived = companies.filter((c) => c.archived && matchesQuery(c));

  // Summary — operating companies exclude pipeline opportunities.
  const summary = useMemo(() => {
    const operating = companies.filter((c) => !c.archived && c.stage !== "pipeline");
    const pipeline = companies.filter((c) => !c.archived && c.stage === "pipeline");
    const revenue = operating.reduce((sum, c) => sum + (c.revenue ?? 0), 0);
    const share = operating.reduce(
      (sum, c) => sum + (c.revenue ?? 0) * (c.ownership / 100),
      0,
    );
    return { count: operating.length, pipeline: pipeline.length, revenue, share };
  }, [companies]);

  const stageCount = (id: StageId) =>
    companies.filter((c) => !c.archived && c.stage === id).length;

  const shownStages = stages.filter((s) => filter === "all" || s.id === filter);

  return (
    <div className="flex flex-col gap-6">
      {/* Page head */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-display text-[0.82rem] font-medium italic text-gold-600">
            Portfolio
          </p>
          <h2 className="mt-0.5 font-display text-[1.6rem] font-bold">Companies</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="ghost" size="sm" icon="download">
            Export portfolio
          </Button>
          <Button variant="primary" size="sm" icon="plus" onClick={() => setAddOpen(true)}>
            Add a new company
          </Button>
        </div>
      </div>

      {/* Summary */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Portfolio companies"
          value={String(summary.count)}
          caption="Across Startup, Active & Growth"
        />
        <StatCard
          label="Combined revenue YTD"
          value={fmtUSD(summary.revenue)}
          delta={{ direction: "up", text: "8.2% vs plan" }}
        />
        <StatCard
          label="Jadeite revenue share"
          value={fmtUSD(summary.share)}
          caption="Weighted by ownership %"
        />
        <StatCard
          label="Pipeline opportunities"
          value={String(summary.pipeline)}
          caption="In due diligence"
        />
      </div>

      {/* Toolbar */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        {/* stage filter chips */}
        <div className="thin-scroll -mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1">
          <FilterChip active={filter === "all"} onClick={() => setFilter("all")}>
            All <span className="text-ink-faint">· {live.length}</span>
          </FilterChip>
          {stages.map((s) => (
            <FilterChip key={s.id} active={filter === s.id} onClick={() => setFilter(s.id)}>
              {s.label} <span className="text-ink-faint">· {stageCount(s.id)}</span>
            </FilterChip>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {/* search */}
          <label className="flex flex-1 items-center gap-2 rounded-md border border-line bg-paper-raised px-3 py-2 text-ink-soft focus-within:border-jade-500 lg:flex-none">
            <Icon name="search" className="h-4 w-4" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search companies…"
              className="w-full bg-transparent text-[0.83rem] placeholder:text-ink-faint focus:outline-none lg:w-44"
            />
          </label>

          {/* archived toggle */}
          <button
            onClick={() => setShowArchived((v) => !v)}
            className={`flex h-9 items-center gap-1.5 rounded-md border px-3 text-[0.8rem] font-semibold transition-colors ${
              showArchived
                ? "border-jade-500 bg-jade-50 text-jade-700"
                : "border-line bg-paper-raised text-ink-soft hover:bg-paper-sunken"
            }`}
          >
            <Icon name="archive" className="h-4 w-4" />
            <span className="hidden sm:inline">Archived</span>
            {archived.length > 0 && (
              <span className="tnum rounded-full bg-paper-sunken px-1.5 text-[0.68rem]">
                {archived.length}
              </span>
            )}
          </button>

          {/* view toggle */}
          <div className="flex overflow-hidden rounded-md border border-line">
            {(["grid", "list"] as const).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                aria-label={`${v} view`}
                className={`flex h-9 w-9 items-center justify-center transition-colors ${
                  view === v
                    ? "bg-jade-100 text-jade-600"
                    : "bg-paper-raised text-ink-faint hover:bg-paper-sunken"
                }`}
              >
                <Icon name={v === "grid" ? "companies" : "list"} className="h-4.25 w-4.25" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      {view === "grid" ? (
        <div className="flex flex-col gap-7">
          {shownStages.map((stage) => {
            const rows = live.filter((c) => c.stage === stage.id);
            if (rows.length === 0) return null;
            return (
              <section key={stage.id}>
                <div className="mb-3 flex items-baseline gap-2.5">
                  <h3 className="font-display text-[1.08rem] font-bold">{stage.label}</h3>
                  <span className="tnum rounded-full bg-paper-sunken px-2 py-0.5 text-[0.72rem] font-bold text-ink-soft">
                    {rows.length}
                  </span>
                  <span className="hidden text-[0.78rem] text-ink-soft sm:inline">
                    {stage.blurb}
                  </span>
                </div>
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {rows.map((c) => (
                    <CompanyCard
                      key={c.id}
                      c={c}
                      onArchive={() => archive(c.id)}
                      onRestore={() => restore(c.id)}
                      onDelete={() => remove(c.id)}
                    />
                  ))}
                </div>
              </section>
            );
          })}
          {live.length === 0 && <EmptyState query={query} />}
        </div>
      ) : (
        <CompanyTable
          rows={live}
          onArchive={archive}
          onRestore={restore}
          onDelete={remove}
        />
      )}

      {/* Archived */}
      {showArchived && archived.length > 0 && (
        <section>
          <div className="mb-3 flex items-baseline gap-2.5">
            <h3 className="font-display text-[1.08rem] font-bold text-ink-soft">Archived</h3>
            <span className="tnum rounded-full bg-paper-sunken px-2 py-0.5 text-[0.72rem] font-bold text-ink-soft">
              {archived.length}
            </span>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {archived.map((c) => (
              <CompanyCard
                key={c.id}
                c={c}
                onArchive={() => archive(c.id)}
                onRestore={() => restore(c.id)}
                onDelete={() => remove(c.id)}
              />
            ))}
          </div>
        </section>
      )}

      {addOpen && (
        <AddCompanyModal
          onClose={() => setAddOpen(false)}
          onCreate={(c) => {
            setCompanies((cs) => [c, ...cs]);
            setAddOpen(false);
          }}
        />
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`whitespace-nowrap rounded-full border px-3 py-1.5 text-[0.8rem] font-semibold transition-colors ${
        active
          ? "border-jade-500 bg-jade-100 text-jade-700"
          : "border-line bg-paper-raised text-ink-soft hover:bg-paper-sunken"
      }`}
    >
      {children}
    </button>
  );
}

function LogoChip({ c, size = "md" }: { c: Company; size?: "sm" | "md" }) {
  const cls = size === "sm" ? "h-7 w-7 text-[0.66rem] rounded-lg" : "h-10 w-10 text-[0.82rem] rounded-xl";
  return (
    <span
      className={`flex shrink-0 items-center justify-center font-display font-bold text-white ${cls}`}
      style={{ backgroundColor: c.color }}
    >
      {c.code}
    </span>
  );
}

function CompanyCard({
  c,
  onArchive,
  onRestore,
  onDelete,
}: {
  c: Company;
  onArchive: () => void;
  onRestore: () => void;
  onDelete: () => void;
}) {
  const isPipeline = c.stage === "pipeline";
  return (
    <Card className={`flex flex-col p-4.5 transition-shadow hover:shadow-(--shadow-md) ${c.archived ? "opacity-70" : ""}`}>
      {/* head */}
      <div className="flex items-start gap-3">
        <LogoChip c={c} />
        <div className="min-w-0 flex-1">
          <p className="truncate font-display text-[1.05rem] font-bold leading-tight">{c.name}</p>
          <p className="mt-0.5 truncate text-[0.78rem] text-ink-soft">{c.sector}</p>
        </div>
        <RowMenu archived={!!c.archived} onArchive={onArchive} onRestore={onRestore} onDelete={onDelete} />
      </div>

      {/* status */}
      <div className="mt-3 flex items-center gap-2">
        <Pill tone={c.status.tone}>{c.status.label}</Pill>
        <Badge tone="gold">{c.ownership}% owned</Badge>
      </div>

      {isPipeline ? (
        <div className="mt-4">
          <div className="mb-1.5 flex items-center justify-between text-[0.76rem]">
            <span className="text-ink-soft">{c.diligence?.label}</span>
            <span className="tnum font-bold text-jade-600">{c.diligence?.progress}%</span>
          </div>
          <div className="h-1.75 overflow-hidden rounded-full bg-paper-sunken">
            <div
              className="h-full rounded-full bg-linear-to-r from-jade-400 to-jade-600"
              style={{ width: `${c.diligence?.progress ?? 0}%` }}
            />
          </div>
        </div>
      ) : (
        <div className="mt-4 grid grid-cols-3 gap-2 border-t border-line-soft pt-3.5">
          <Metric label="Revenue YTD" value={fmtUSD(c.revenue)} />
          <Metric
            label="Net margin"
            value={c.margin == null ? "—" : `${c.margin > 0 ? "" : ""}${c.margin}%`}
            tone={c.margin == null ? undefined : c.margin >= 0 ? "good" : "critical"}
          />
          <Metric label="People" value={String(c.employees)} />
        </div>
      )}

      {/* footer */}
      <div className="mt-4 flex items-center justify-between gap-2 pt-0.5">
        <span className="text-[0.74rem] text-ink-faint">Updated {c.updated}</span>
        {c.archived ? (
          <Button variant="soft" size="sm" icon="restore" onClick={onRestore}>
            Restore
          </Button>
        ) : isPipeline ? (
          <Button variant="soft" size="sm" icon="chevron-right">
            Convert to company
          </Button>
        ) : (
          <Button variant="ghost" size="sm" icon="external">
            Open workspace
          </Button>
        )}
      </div>
    </Card>
  );
}

function Metric({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: "good" | "critical";
}) {
  const color = tone === "good" ? "text-good" : tone === "critical" ? "text-critical" : "text-ink";
  return (
    <div>
      <p className="text-[0.68rem] font-semibold uppercase tracking-wider text-ink-faint">
        {label}
      </p>
      <p className={`tnum mt-0.5 font-display text-[1rem] font-bold ${color}`}>{value}</p>
    </div>
  );
}

function RowMenu({
  archived,
  onArchive,
  onRestore,
  onDelete,
}: {
  archived: boolean;
  onArchive: () => void;
  onRestore: () => void;
  onDelete: () => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const item =
    "flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-[0.82rem] font-medium transition-colors";

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Company actions"
        aria-expanded={open}
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-line text-ink-soft hover:bg-paper-sunken"
      >
        <Icon name="more" className="h-4.25 w-4.25" />
      </button>
      {open && (
        <div className="absolute right-0 top-9 z-20 w-48 rounded-xl border border-line bg-paper-raised p-1.5 shadow-(--shadow-md)">
          <button className={`${item} text-ink hover:bg-paper-sunken`} onClick={() => setOpen(false)}>
            <Icon name="external" className="h-4 w-4 text-ink-soft" /> Open workspace
          </button>
          {archived ? (
            <button
              className={`${item} text-ink hover:bg-paper-sunken`}
              onClick={() => {
                onRestore();
                setOpen(false);
              }}
            >
              <Icon name="restore" className="h-4 w-4 text-jade-600" /> Restore
            </button>
          ) : (
            <button
              className={`${item} text-ink hover:bg-paper-sunken`}
              onClick={() => {
                onArchive();
                setOpen(false);
              }}
            >
              <Icon name="archive" className="h-4 w-4 text-ink-soft" /> Archive
            </button>
          )}
          <div className="my-1 border-t border-line-soft" />
          <button
            disabled={!archived}
            title={archived ? undefined : "Archive first — deletion needs Owner approval"}
            className={`${item} ${
              archived
                ? "text-critical hover:bg-critical-bg"
                : "cursor-not-allowed text-ink-faint"
            }`}
            onClick={() => {
              if (!archived) return;
              if (window.confirm("Permanently delete this company? This cannot be undone.")) {
                onDelete();
              }
              setOpen(false);
            }}
          >
            <Icon name="close" className="h-4 w-4" /> Delete
            {!archived && <span className="ml-auto text-[0.66rem]">Restricted</span>}
          </button>
        </div>
      )}
    </div>
  );
}

function CompanyTable({
  rows,
  onArchive,
  onRestore,
  onDelete,
}: {
  rows: Company[];
  onArchive: (id: string) => void;
  onRestore: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  if (rows.length === 0) return <EmptyState query="" />;
  const stageLabel = (id: StageId) => stages.find((s) => s.id === id)?.label ?? id;
  return (
    <Card>
      <div className="thin-scroll overflow-x-auto">
        <table className="w-full text-[0.85rem]">
          <thead>
            <tr className="border-b border-line text-left">
              {["Company", "Stage", "Status", "Revenue YTD", "Margin", "Owned", "Updated", ""].map(
                (h) => (
                  <th
                    key={h}
                    className="whitespace-nowrap px-4 py-2.5 text-[0.7rem] font-bold uppercase tracking-[0.06em] text-ink-faint"
                  >
                    {h}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody>
            {rows.map((c) => (
              <tr
                key={c.id}
                className="border-b border-line-soft transition-colors last:border-0 hover:bg-paper-sunken"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    <LogoChip c={c} size="sm" />
                    <div className="min-w-0">
                      <p className="font-semibold">{c.name}</p>
                      <p className="text-[0.74rem] text-ink-faint">{c.sector}</p>
                    </div>
                  </div>
                </td>
                <td className="whitespace-nowrap px-4 py-3">
                  <Badge>{stageLabel(c.stage)}</Badge>
                </td>
                <td className="px-4 py-3">
                  <Pill tone={c.status.tone}>{c.status.label}</Pill>
                </td>
                <td className="tnum whitespace-nowrap px-4 py-3">{fmtUSD(c.revenue)}</td>
                <td className="tnum whitespace-nowrap px-4 py-3">
                  {c.margin == null ? (
                    "—"
                  ) : (
                    <span className={c.margin >= 0 ? "text-good" : "text-critical"}>{c.margin}%</span>
                  )}
                </td>
                <td className="tnum whitespace-nowrap px-4 py-3">{c.ownership}%</td>
                <td className="whitespace-nowrap px-4 py-3 text-ink-soft">{c.updated}</td>
                <td className="px-4 py-3 text-right">
                  <RowMenu
                    archived={!!c.archived}
                    onArchive={() => onArchive(c.id)}
                    onRestore={() => onRestore(c.id)}
                    onDelete={() => onDelete(c.id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

function EmptyState({ query }: { query: string }) {
  return (
    <div className="flex min-h-[30vh] flex-col items-center justify-center rounded-2xl border border-dashed border-line bg-paper-raised/50 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-jade-100 text-jade-600">
        <Icon name="companies" className="h-6 w-6" />
      </span>
      <p className="mt-4 font-display text-[1.1rem] font-bold">No companies found</p>
      <p className="mt-1 max-w-sm text-[0.83rem] text-ink-soft">
        {query
          ? `Nothing matches “${query}”. Try a different search or clear the filter.`
          : "Adjust the filters to see companies in this stage."}
      </p>
    </div>
  );
}
