import { useEffect, useState } from "react";
import { Button } from "../../components/ui/Button";
import { Icon } from "../../components/ui/Icon";
import { scopes } from "../Employees/data";
import type { CompanyKpi, KpiFormat } from "./data";

interface Props {
  onClose: () => void;
  onCreate: (kpi: CompanyKpi) => void;
}

const fieldClass =
  "w-full rounded-md border border-line bg-paper-sunken px-3 py-2.5 text-[0.86rem] text-ink placeholder:text-ink-faint focus:border-jade-500 focus:outline-none";
const labelClass =
  "mb-1.5 block text-[0.74rem] font-semibold uppercase tracking-[0.06em] text-ink-faint";

const companyScopes = scopes.filter((s) => s.code !== "GRP");

export function AddKpiModal({ onClose, onCreate }: Props) {
  const [name, setName] = useState("");
  const [company, setCompany] = useState(companyScopes[0]?.code ?? "QY");
  const [owner, setOwner] = useState("");
  const [format, setFormat] = useState<KpiFormat>("pct");
  const [target, setTarget] = useState("");
  const [actual, setActual] = useState("");
  const [higherIsBetter, setHib] = useState(true);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const canSave = name.trim() !== "" && target.trim() !== "";

  const save = () => {
    onCreate({
      id: `kpi-${Date.now()}`,
      name: name.trim(),
      companyCode: company,
      owner: owner.trim() || "Unassigned",
      format,
      target: Number(target) || 0,
      actual: Number(actual) || 0,
      period: "H1 2026",
      higherIsBetter,
      trend: "flat",
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <button aria-label="Close" onClick={onClose} className="absolute inset-0 bg-jade-950/45 backdrop-blur-sm" />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Add company KPI"
        className="relative flex w-full max-w-lg flex-col overflow-hidden rounded-t-2xl border border-line bg-paper-raised shadow-(--shadow-lg) sm:rounded-2xl"
      >
        <div className="flex items-center justify-between gap-3 border-b border-line-soft px-5 py-4">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-jade-100 text-jade-600">
              <Icon name="kpis" className="h-4.5 w-4.5" strokeWidth={1.7} />
            </span>
            <h2 className="font-display text-[1.15rem] font-bold leading-tight">Add company KPI</h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="flex h-8.5 w-8.5 items-center justify-center rounded-[9px] border border-line text-ink-soft hover:bg-paper-sunken"
          >
            <Icon name="close" className="h-4.25 w-4.25" />
          </button>
        </div>

        <div className="flex flex-col gap-4 p-5">
          <div>
            <label className={labelClass} htmlFor="k-name">KPI name</label>
            <input id="k-name" className={fieldClass} placeholder="e.g. Gross Margin" value={name} onChange={(e) => setName(e.target.value)} autoFocus />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass} htmlFor="k-company">Company</label>
              <select id="k-company" className={fieldClass} value={company} onChange={(e) => setCompany(e.target.value)}>
                {companyScopes.map((s) => (
                  <option key={s.code} value={s.code}>{s.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass} htmlFor="k-owner">Owner</label>
              <input id="k-owner" className={fieldClass} placeholder="e.g. Lena Park" value={owner} onChange={(e) => setOwner(e.target.value)} />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className={labelClass} htmlFor="k-format">Unit</label>
              <select id="k-format" className={fieldClass} value={format} onChange={(e) => setFormat(e.target.value as KpiFormat)}>
                <option value="pct">Percent</option>
                <option value="usd">Currency</option>
                <option value="x">Multiple</option>
                <option value="num">Number</option>
              </select>
            </div>
            <div>
              <label className={labelClass} htmlFor="k-target">Target</label>
              <input id="k-target" type="number" className={fieldClass} placeholder="0" value={target} onChange={(e) => setTarget(e.target.value)} />
            </div>
            <div>
              <label className={labelClass} htmlFor="k-actual">Actual</label>
              <input id="k-actual" type="number" className={fieldClass} placeholder="0" value={actual} onChange={(e) => setActual(e.target.value)} />
            </div>
          </div>

          <label className="flex cursor-pointer items-center gap-2.5 text-[0.83rem]">
            <input type="checkbox" checked={higherIsBetter} onChange={(e) => setHib(e.target.checked)} className="h-4.5 w-4.5 accent-jade-600" />
            Higher value is better
            <span className="text-ink-faint">— untick for cost / spend metrics</span>
          </label>
        </div>

        <div className="flex items-center justify-end gap-2.5 border-t border-line-soft px-5 py-3.5">
          <Button variant="ghost" size="md" onClick={onClose}>Cancel</Button>
          <Button variant="primary" size="md" icon="check" disabled={!canSave} onClick={save}>
            Add KPI
          </Button>
        </div>
      </div>
    </div>
  );
}
