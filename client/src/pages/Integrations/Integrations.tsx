import { useState } from "react";
import { Button } from "../../components/ui/Button";
import { intCompanies } from "./data";
import { IntegrationCenterSection } from "./IntegrationCenterSection";
import { AiAnalyticsSection } from "./AiAnalyticsSection";
import { GovernanceSection } from "./GovernanceSection";

type Section = "center" | "ai" | "governance";

const sections: { id: Section; label: string; scoped: boolean }[] = [
  { id: "center", label: "Integration Center", scoped: true },
  { id: "ai", label: "AI Analytics", scoped: true },
  { id: "governance", label: "Data Governance", scoped: false },
];

export default function Integrations() {
  const [section, setSection] = useState<Section>("center");
  /** null = the whole portfolio. */
  const [companyId, setCompanyId] = useState<string | null>(null);

  const scoped = sections.find((s) => s.id === section)?.scoped ?? false;

  return (
    <div className="flex flex-col gap-6">
      {/* head */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-display text-[0.82rem] font-medium italic text-gold-600">Data layer</p>
          <h2 className="mt-0.5 font-display text-[1.6rem] font-bold">Integrations &amp; AI</h2>
          <p className="mt-0.5 text-[0.85rem] text-ink-soft">
            Connect approved business systems, monitor sync health, and turn the data into clear analysis.
          </p>
        </div>
        <Button variant="primary" size="md" icon="plus">
          Connect a source
        </Button>
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

      {/* company filter (scoped sections only) */}
      {scoped && (
        <div className="thin-scroll flex gap-1 overflow-x-auto border-b border-line">
          <button
            onClick={() => setCompanyId(null)}
            className={`whitespace-nowrap border-b-2 px-3.5 py-2.5 text-[0.85rem] font-semibold transition-colors ${
              companyId === null ? "border-jade-500 text-ink" : "border-transparent text-ink-soft hover:text-ink"
            }`}
          >
            All portfolio
          </button>
          {intCompanies.map((x) => {
            const active = x.id === companyId;
            return (
              <button
                key={x.id}
                onClick={() => setCompanyId(x.id)}
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
      {section === "center" && <IntegrationCenterSection companyId={companyId} />}
      {section === "ai" && <AiAnalyticsSection companyId={companyId} />}
      {section === "governance" && <GovernanceSection />}
    </div>
  );
}
