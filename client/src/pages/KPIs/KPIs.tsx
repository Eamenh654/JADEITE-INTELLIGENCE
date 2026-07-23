import { useMemo, useState, type ReactNode } from "react";
import { Button } from "../../components/ui/Button";
import { StatCard } from "../../components/ui/StatCard";
import { Pill } from "../../components/ui/Pill";
import { Icon } from "../../components/ui/Icon";
import { Avatar, ScopeTag } from "../Employees/parts";
import { scopes } from "../Employees/data";
import { KpiReviewDrawer } from "./KpiReviewDrawer";
import { AddKpiModal } from "./AddKpiModal";
import {
  QUARTER,
  attainment,
  companyKpis as seedCompanyKpis,
  fmtVal,
  initialReviews,
  reviewEmployee,
  reviewStages,
  statusFor,
  weightedScore,
  type CompanyKpi,
  type Review,
} from "./data";

type Tab = "company" | "employee";
const companyScopes = scopes.filter((s) => s.code !== "GRP");

export default function KPIs() {
  const [tab, setTab] = useState<Tab>("company");
  const [kpis, setKpis] = useState<CompanyKpi[]>(seedCompanyKpis);
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [scope, setScope] = useState<string>("all");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [addOpen, setAddOpen] = useState(false);

  const setStage = (employeeId: string, stage: number) =>
    setReviews((rs) => rs.map((r) => (r.employeeId === employeeId ? { ...r, stage } : r)));

  const resolveAppeal = (employeeId: string, kpiId: string, outcome: string) =>
    setReviews((rs) =>
      rs.map((r) =>
        r.employeeId === employeeId
          ? {
              ...r,
              kpis: r.kpis.map((k) =>
                k.id === kpiId && k.appeal
                  ? { ...k, appeal: { ...k.appeal, status: "resolved", outcome } }
                  : k,
              ),
            }
          : r,
      ),
    );

  const matchScope = (code: string) => scope === "all" || code === scope;

  return (
    <div className="flex flex-col gap-6">
      {/* Page head + tabs */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-display text-[0.82rem] font-medium italic text-gold-600">Performance</p>
          <h2 className="mt-0.5 font-display text-[1.6rem] font-bold">KPIs</h2>
        </div>
        <div className="flex rounded-md border border-line bg-paper-raised p-0.5">
          {(
            [
              { id: "company", label: "Company KPIs" },
              { id: "employee", label: "Employee KPIs" },
            ] as const
          ).map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`rounded-[7px] px-3.5 py-1.5 text-[0.82rem] font-semibold transition-colors ${
                tab === t.id ? "bg-jade-100 text-jade-700" : "text-ink-soft hover:bg-paper-sunken"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {tab === "company" ? (
        <CompanyTab
          kpis={kpis.filter((k) => matchScope(k.companyCode))}
          query={query}
          scope={scope}
          onScope={setScope}
          onQuery={setQuery}
          onAdd={() => setAddOpen(true)}
          allKpis={kpis}
        />
      ) : (
        <EmployeeTab
          reviews={reviews.filter((r) => matchScope(reviewEmployee(r.employeeId)?.companyCode ?? ""))}
          allReviews={reviews}
          query={query}
          scope={scope}
          onScope={setScope}
          onQuery={setQuery}
          onOpen={setSelectedId}
        />
      )}

      {selectedId &&
        (() => {
          const review = reviews.find((r) => r.employeeId === selectedId);
          const employee = review && reviewEmployee(review.employeeId);
          if (!review || !employee) return null;
          return (
            <KpiReviewDrawer
              review={review}
              employee={employee}
              onClose={() => setSelectedId(null)}
              onSetStage={setStage}
              onResolveAppeal={resolveAppeal}
            />
          );
        })()}

      {addOpen && (
        <AddKpiModal
          onClose={() => setAddOpen(false)}
          onCreate={(k) => {
            setKpis((ks) => [k, ...ks]);
            setAddOpen(false);
          }}
        />
      )}
    </div>
  );
}

/* ------------------------------ Company tab ----------------------- */

function CompanyTab({
  kpis,
  allKpis,
  query,
  scope,
  onScope,
  onQuery,
  onAdd,
}: {
  kpis: CompanyKpi[];
  allKpis: CompanyKpi[];
  query: string;
  scope: string;
  onScope: (s: string) => void;
  onQuery: (q: string) => void;
  onAdd: () => void;
}) {
  const q = query.trim().toLowerCase();
  const rows = kpis.filter(
    (k) => !q || k.name.toLowerCase().includes(q) || k.owner.toLowerCase().includes(q),
  );

  const summary = useMemo(() => {
    const ratios = allKpis.map((k) => attainment(k.target, k.actual, k.higherIsBetter) ?? 0);
    const onTrack = ratios.filter((r) => r >= 1).length;
    const atRisk = ratios.filter((r) => r < 0.9).length;
    const avg = ratios.length
      ? Math.round((ratios.reduce((s, r) => s + r, 0) / ratios.length) * 100)
      : 0;
    return { total: allKpis.length, onTrack, atRisk, avg };
  }, [allKpis]);

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Company KPIs" value={String(summary.total)} caption="Tracked this period" />
        <StatCard label="On track" value={String(summary.onTrack)} caption="At or above target" />
        <StatCard label="At risk" value={String(summary.atRisk)} caption="Below 90% attainment" />
        <StatCard label="Avg attainment" value={`${summary.avg}%`} caption="Across all KPIs" />
      </div>

      <Toolbar
        scope={scope}
        onScope={onScope}
        counts={(code) => allKpis.filter((k) => k.companyCode === code).length}
        allCount={allKpis.length}
        query={query}
        onQuery={onQuery}
        placeholder="Search KPI or owner…"
        action={
          <Button variant="primary" size="sm" icon="plus" onClick={onAdd}>
            Add company KPI
          </Button>
        }
      />

      {rows.length === 0 ? (
        <EmptyState icon="kpis" query={query} />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {rows.map((k) => (
            <CompanyKpiCard key={k.id} k={k} />
          ))}
        </div>
      )}
    </>
  );
}

function CompanyKpiCard({ k }: { k: CompanyKpi }) {
  const ratio = attainment(k.target, k.actual, k.higherIsBetter);
  const st = statusFor(ratio);
  const pct = ratio == null ? 0 : Math.round(ratio * 100);
  const barTone = ratio == null ? "bg-ink-faint" : ratio >= 1 ? "bg-good" : ratio >= 0.9 ? "bg-warn" : "bg-critical";
  return (
    <div className="flex flex-col rounded-2xl border border-line bg-paper-raised p-4.5 shadow-(--shadow-sm)">
      <div className="flex items-start justify-between gap-2">
        <p className="min-w-0 font-display text-[1.02rem] font-bold leading-tight">{k.name}</p>
        <Pill tone={st.tone}>{st.label}</Pill>
      </div>
      <div className="mt-2 flex items-center gap-2.5">
        <ScopeTag code={k.companyCode} />
        <span className="truncate text-[0.74rem] text-ink-faint">· {k.owner}</span>
      </div>

      <div className="mt-4 flex items-end gap-2">
        <span className="tnum font-display text-[1.5rem] font-bold leading-none">
          {fmtVal(k.actual, k.format)}
        </span>
        <span className="mb-0.5 text-[0.78rem] text-ink-soft">
          of {fmtVal(k.target, k.format)} target
        </span>
      </div>

      <div className="mt-2.5 h-1.75 overflow-hidden rounded-full bg-paper-sunken">
        <div className={`h-full rounded-full ${barTone}`} style={{ width: `${Math.min(pct, 100)}%` }} />
      </div>

      <div className="mt-3 flex items-center justify-between text-[0.76rem]">
        <span className="tnum font-bold text-ink-soft">{ratio == null ? "—" : `${pct}% attainment`}</span>
        <span className="flex items-center gap-2 text-ink-faint">
          <TrendMark trend={k.trend} />
          {k.period}
        </span>
      </div>
    </div>
  );
}

function TrendMark({ trend }: { trend: "up" | "down" | "flat" }) {
  if (trend === "flat")
    return <span className="inline-block h-0.5 w-3 rounded bg-ink-faint" title="Flat" />;
  return (
    <Icon
      name={trend === "up" ? "arrow-up" : "arrow-down"}
      className="h-3.5 w-3.5"
      strokeWidth={2.2}
      aria-label={trend === "up" ? "Trending up" : "Trending down"}
    />
  );
}

/* ------------------------------ Employee tab ---------------------- */

function EmployeeTab({
  reviews,
  allReviews,
  query,
  scope,
  onScope,
  onQuery,
  onOpen,
}: {
  reviews: Review[];
  allReviews: Review[];
  query: string;
  scope: string;
  onScope: (s: string) => void;
  onQuery: (q: string) => void;
  onOpen: (id: string) => void;
}) {
  const q = query.trim().toLowerCase();
  const rows = reviews.filter((r) => {
    const e = reviewEmployee(r.employeeId);
    return !q || e?.name.toLowerCase().includes(q) || e?.role.toLowerCase().includes(q);
  });

  const hasOpenAppeal = (r: Review) => r.kpis.some((k) => k.appeal && k.appeal.status !== "resolved");

  const summary = useMemo(() => {
    const inReview = allReviews.filter((r) => r.stage < reviewStages.length - 1).length;
    const published = allReviews.filter((r) => r.stage === reviewStages.length - 1).length;
    const appeals = allReviews.filter(hasOpenAppeal).length;
    const scores = allReviews.map((r) => weightedScore(r.kpis)).filter((s): s is number => s != null);
    const avg = scores.length ? Math.round(scores.reduce((s, v) => s + v, 0) / scores.length) : 0;
    return { inReview, published, appeals, avg };
  }, [allReviews]);

  return (
    <>
      {/* Cycle banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-line bg-brand-panel px-5 py-4 text-white">
        <div>
          <p className="font-display text-[0.78rem] font-medium italic text-gold-500">Quarterly review</p>
          <p className="font-display text-[1.15rem] font-bold">{QUARTER} evaluation cycle</p>
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          {reviewStages.map((s, i) => (
            <span
              key={s.label}
              className="rounded-full border border-white/20 bg-white/10 px-2.5 py-1 text-[0.68rem] font-semibold text-white/90"
            >
              {i + 1}. {s.label}
            </span>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="In review" value={String(summary.inReview)} caption="Not yet published" />
        <StatCard label="Avg weighted score" value={`${summary.avg}%`} caption="Scored reviews" />
        <StatCard label="Appeals open" value={String(summary.appeals)} caption="Awaiting decision" />
        <StatCard label="Published" value={String(summary.published)} caption="Feeds bonus round" />
      </div>

      <Toolbar
        scope={scope}
        onScope={onScope}
        counts={(code) => allReviews.filter((r) => reviewEmployee(r.employeeId)?.companyCode === code).length}
        allCount={allReviews.length}
        query={query}
        onQuery={onQuery}
        placeholder="Search person or role…"
      />

      {rows.length === 0 ? (
        <EmptyState icon="employees" query={query} />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {rows.map((r) => (
            <ReviewCard key={r.employeeId} r={r} onOpen={() => onOpen(r.employeeId)} appeal={hasOpenAppeal(r)} />
          ))}
        </div>
      )}
    </>
  );
}

function ReviewCard({ r, onOpen, appeal }: { r: Review; onOpen: () => void; appeal: boolean }) {
  const e = reviewEmployee(r.employeeId);
  if (!e) return null;
  const score = weightedScore(r.kpis);
  const stage = reviewStages[r.stage];
  const scoreColor = score == null ? "text-ink-faint" : score >= 100 ? "text-good" : score >= 85 ? "text-gold-600" : "text-critical";

  return (
    <button
      onClick={onOpen}
      className="flex flex-col rounded-2xl border border-line bg-paper-raised p-4.5 text-left shadow-(--shadow-sm) transition-shadow hover:shadow-(--shadow-md)"
    >
      <div className="flex items-start gap-3">
        <Avatar person={e} />
        <div className="min-w-0 flex-1">
          <p className="truncate font-display text-[1.02rem] font-bold leading-tight">{e.name}</p>
          <p className="mt-0.5 truncate text-[0.78rem] text-ink-soft">{e.role}</p>
        </div>
        {appeal && (
          <span className="inline-flex items-center gap-1 rounded-md bg-gold-100 px-1.5 py-0.5 text-[0.64rem] font-bold text-gold-700">
            <Icon name="flag" className="h-3 w-3" /> Appeal
          </span>
        )}
      </div>

      <div className="mt-3 flex items-center justify-between">
        <ScopeTag code={e.companyCode} />
        <div className="text-right">
          <span className={`tnum font-display text-[1.15rem] font-bold leading-none ${scoreColor}`}>
            {score == null ? "—" : `${score}%`}
          </span>
          <span className="ml-1 text-[0.72rem] text-ink-faint">· {r.kpis.length} KPIs</span>
        </div>
      </div>

      {/* stage progress */}
      <div className="mt-4 border-t border-line-soft pt-3">
        <div className="mb-1.5 flex items-center justify-between text-[0.74rem]">
          <span className="font-semibold text-ink-soft">{stage.label}</span>
          <span className="text-ink-faint">Stage {r.stage + 1} of {reviewStages.length}</span>
        </div>
        <div className="flex gap-1">
          {reviewStages.map((_, i) => (
            <span
              key={i}
              className={`h-1.5 flex-1 rounded-full ${i <= r.stage ? "bg-jade-500" : "bg-paper-sunken"}`}
            />
          ))}
        </div>
      </div>
    </button>
  );
}

/* ------------------------------ Shared ---------------------------- */

function Toolbar({
  scope,
  onScope,
  counts,
  allCount,
  query,
  onQuery,
  placeholder,
  action,
}: {
  scope: string;
  onScope: (s: string) => void;
  counts: (code: string) => number;
  allCount: number;
  query: string;
  onQuery: (q: string) => void;
  placeholder: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      <div className="thin-scroll -mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1">
        <Chip active={scope === "all"} onClick={() => onScope("all")}>
          All <span className="text-ink-faint">· {allCount}</span>
        </Chip>
        {companyScopes.map((s) => (
          <Chip key={s.code} active={scope === s.code} onClick={() => onScope(s.code)}>
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: s.color }} />
            {s.name} <span className="text-ink-faint">· {counts(s.code)}</span>
          </Chip>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <label className="flex flex-1 items-center gap-2 rounded-md border border-line bg-paper-raised px-3 py-2 text-ink-soft focus-within:border-jade-500 lg:flex-none">
          <Icon name="search" className="h-4 w-4" />
          <input
            type="search"
            value={query}
            onChange={(e) => onQuery(e.target.value)}
            placeholder={placeholder}
            className="w-full bg-transparent text-[0.83rem] placeholder:text-ink-faint focus:outline-none lg:w-48"
          />
        </label>
        {action}
      </div>
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-3 py-1.5 text-[0.8rem] font-semibold transition-colors ${
        active
          ? "border-jade-500 bg-jade-100 text-jade-700"
          : "border-line bg-paper-raised text-ink-soft hover:bg-paper-sunken"
      }`}
    >
      {children}
    </button>
  );
}

function EmptyState({ query, icon }: { query: string; icon: "kpis" | "employees" }) {
  return (
    <div className="flex min-h-[28vh] flex-col items-center justify-center rounded-2xl border border-dashed border-line bg-paper-raised/50 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-jade-100 text-jade-600">
        <Icon name={icon} className="h-6 w-6" />
      </span>
      <p className="mt-4 font-display text-[1.1rem] font-bold">Nothing here yet</p>
      <p className="mt-1 max-w-sm text-[0.83rem] text-ink-soft">
        {query ? `Nothing matches “${query}”.` : "Adjust the filters to see results."}
      </p>
    </div>
  );
}
