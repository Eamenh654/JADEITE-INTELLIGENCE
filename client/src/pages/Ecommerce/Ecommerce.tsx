import { useState } from "react";
import { Icon } from "../../components/ui/Icon";
import { PERIOD, ecomCompanies, getEcom } from "./data";
import { DashboardSection } from "./DashboardSection";
import { DataApprovalSection } from "./DataApprovalSection";
import { CampaignsSection } from "./CampaignsSection";
import { ProfitabilitySection } from "./ProfitabilitySection";
import { ComparisonSection } from "./ComparisonSection";
import { AlertsSection } from "./AlertsSection";

type Section = "dashboard" | "data" | "campaigns" | "profit" | "comparison" | "alerts";

const sections: { id: Section; label: string; scoped: boolean }[] = [
  { id: "dashboard", label: "Dashboard", scoped: true },
  { id: "data", label: "Data & Approval", scoped: true },
  { id: "campaigns", label: "Campaigns", scoped: true },
  { id: "profit", label: "Profitability", scoped: true },
  { id: "comparison", label: "Comparison", scoped: false },
  { id: "alerts", label: "Alerts", scoped: false },
];

export default function Ecommerce() {
  const [section, setSection] = useState<Section>("dashboard");
  const [id, setId] = useState(ecomCompanies[0]?.id ?? "");

  const scoped = sections.find((s) => s.id === section)?.scoped ?? false;
  const view = getEcom(id) ?? getEcom(ecomCompanies[0]?.id ?? "");

  return (
    <div className="flex flex-col gap-6">
      {/* head */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-display text-[0.82rem] font-medium italic text-gold-600">Commerce</p>
          <h2 className="mt-0.5 font-display text-[1.6rem] font-bold">E-Commerce</h2>
        </div>
        <div className="flex items-center gap-1.5 rounded-full border border-line bg-paper-raised px-3 py-1.5 text-[0.8rem] font-medium">
          <Icon name="calendar" className="h-3.5 w-3.5 text-ink-soft" />
          {PERIOD}
        </div>
      </div>

      {/* section switcher */}
      <div className="thin-scroll -mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1">
        {sections.map((s) => (
          <button
            key={s.id}
            onClick={() => setSection(s.id)}
            className={`whitespace-nowrap rounded-full border px-3.5 py-1.5 text-[0.82rem] font-semibold transition-colors ${
              section === s.id
                ? "border-jade-500 bg-jade-100 text-jade-700"
                : "border-line bg-paper-raised text-ink-soft hover:bg-paper-sunken"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* company selector (company-scoped sections only) */}
      {scoped && (
        <div className="thin-scroll flex gap-1 overflow-x-auto border-b border-line">
          {ecomCompanies.map((x) => {
            const active = x.id === (view?.company.id ?? id);
            return (
              <button
                key={x.id}
                onClick={() => setId(x.id)}
                className={`flex items-center gap-2 whitespace-nowrap border-b-2 px-3.5 py-2.5 text-[0.85rem] font-semibold transition-colors ${
                  active ? "border-jade-500 text-ink" : "border-transparent text-ink-soft hover:text-ink"
                }`}
              >
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: x.color }} />
                {x.name}
              </button>
            );
          })}
        </div>
      )}

      {/* section body */}
      {section === "dashboard" && view && <DashboardSection view={view} />}
      {section === "data" && view && <DataApprovalSection view={view} />}
      {section === "campaigns" && view && <CampaignsSection view={view} />}
      {section === "profit" && view && <ProfitabilitySection view={view} />}
      {section === "comparison" && <ComparisonSection />}
      {section === "alerts" && <AlertsSection />}
    </div>
  );
}
