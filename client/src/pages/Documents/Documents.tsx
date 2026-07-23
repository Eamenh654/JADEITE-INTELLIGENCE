import { useState } from "react";
import { Card } from "../../components/ui/Card";
import { Pill } from "../../components/ui/Pill";
import { Button } from "../../components/ui/Button";
import { Icon } from "../../components/ui/Icon";
import { UploadDocumentModal } from "./UploadDocumentModal";
import {
  categories,
  categoryCount,
  categoryLabel,
  docCompany,
  expiryMeta,
  financeCompanies,
  initialDocs,
  type Doc,
  type DocCategory,
} from "./data";

export default function Documents() {
  const [docs, setDocs] = useState<Doc[]>(initialDocs);
  const [category, setCategory] = useState<DocCategory | null>(null);
  const [companyId, setCompanyId] = useState<string>("");
  const [query, setQuery] = useState("");
  const [uploading, setUploading] = useState(false);

  const visible = docs.filter(
    (d) =>
      (category === null || d.category === category) &&
      (companyId === "" || d.companyId === companyId) &&
      (query.trim() === "" || d.name.toLowerCase().includes(query.trim().toLowerCase())),
  );

  const addDoc = (doc: Doc) => {
    setDocs((prev) => [doc, ...prev]);
    setUploading(false);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* head */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-display text-[0.82rem] font-medium italic text-gold-600">Records</p>
          <h2 className="mt-0.5 font-display text-[1.6rem] font-bold">Document library</h2>
          <p className="mt-0.5 text-[0.85rem] text-ink-soft">
            Every company's important records in one controlled place — versioned, owned and access-aware.
          </p>
        </div>
        <Button variant="primary" size="md" icon="upload" onClick={() => setUploading(true)}>
          Upload document
        </Button>
      </div>

      {/* category cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {categories.map((c) => {
          const active = category === c.id;
          return (
            <button
              key={c.id}
              onClick={() => setCategory(active ? null : c.id)}
              className={`flex items-center gap-3 rounded-2xl border bg-paper-raised p-4 text-left shadow-(--shadow-sm) transition-colors ${
                active ? "border-jade-500 ring-1 ring-jade-500/40" : "border-line hover:bg-paper-sunken"
              }`}
            >
              <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${active ? "bg-jade-600 text-white" : "bg-jade-100 text-jade-600"}`}>
                <Icon name="documents" className="h-5 w-5" />
              </span>
              <div>
                <p className="text-[0.86rem] font-bold leading-tight">{c.label}</p>
                <p className="text-[0.76rem] text-ink-soft">{categoryCount(docs, c.id)} files</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-52 flex-1">
          <Icon name="search" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search documents…"
            aria-label="Search documents"
            className="w-full rounded-md border border-line bg-paper-raised py-2 pl-9 pr-3 text-[0.84rem] text-ink placeholder:text-ink-faint focus:border-jade-500 focus:outline-none"
          />
        </div>
        <select
          value={companyId}
          onChange={(e) => setCompanyId(e.target.value)}
          aria-label="Filter by company"
          className="rounded-md border border-line bg-paper-raised px-3 py-2 text-[0.82rem] font-medium text-ink focus:border-jade-500 focus:outline-none"
        >
          <option value="">All companies</option>
          {financeCompanies.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        {category && (
          <button
            onClick={() => setCategory(null)}
            className="inline-flex items-center gap-1.5 rounded-md border border-line bg-paper-raised px-3 py-2 text-[0.82rem] font-medium text-ink-soft hover:bg-paper-sunken"
          >
            <Icon name="close" className="h-3.5 w-3.5" /> {categoryLabel[category]}
          </button>
        )}
      </div>

      {/* table */}
      <Card>
        <div className="flex items-baseline justify-between border-b border-line-soft px-5 py-4">
          <h3 className="font-display text-[1.02rem] font-bold">
            {category ? categories.find((c) => c.id === category)?.label : "All documents"}
          </h3>
          <span className="text-[0.76rem] text-ink-faint">{visible.length} shown</span>
        </div>
        <div className="thin-scroll overflow-x-auto">
          <table className="w-full text-[0.85rem]">
            <thead>
              <tr className="border-b border-line text-left">
                {["Document", "Company", "Category", "Version", "Expiry", "Updated", ""].map((h, i) => (
                  <th
                    key={h || "act"}
                    className={`whitespace-nowrap px-4 py-2.5 text-[0.7rem] font-bold uppercase tracking-wider text-ink-faint ${i >= 3 ? "text-right" : ""}`}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visible.map((d) => {
                const co = docCompany(d.companyId);
                const exp = expiryMeta(d.expiryDays);
                return (
                  <tr key={d.id} className="border-b border-line-soft last:border-0 hover:bg-paper-sunken">
                    <td className="px-4 py-3">
                      <div className="flex items-start gap-2.5">
                        <Icon name="documents" className="mt-0.5 h-4.5 w-4.5 shrink-0 text-jade-600" />
                        <div className="min-w-0">
                          <p className="font-semibold">{d.name}</p>
                          <p className="flex items-center gap-1.5 text-[0.74rem] text-ink-faint">
                            {d.owner}
                            {d.access === "restricted" && (
                              <span className="inline-flex items-center gap-0.5 text-warn">
                                <Icon name="lock" className="h-3 w-3" /> Restricted
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="flex items-center gap-2 whitespace-nowrap text-ink-soft">
                        <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: co.color }} />
                        {co.name}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-ink-soft">{categoryLabel[d.category]}</td>
                    <td className="tnum px-4 py-3 text-right text-ink-soft">v{d.version}</td>
                    <td className="px-4 py-3 text-right">
                      <span className="inline-flex justify-end">
                        {d.expiryDays == null ? (
                          <span className="text-ink-faint">—</span>
                        ) : (
                          <Pill tone={exp.tone}>{exp.label}</Pill>
                        )}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-right text-ink-faint">{d.updated}</td>
                    <td className="px-4 py-3 text-right">
                      <Button variant="ghost" size="sm" icon="external">Open</Button>
                    </td>
                  </tr>
                );
              })}
              {visible.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-[0.85rem] text-ink-faint">
                    No documents match your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {uploading && <UploadDocumentModal onClose={() => setUploading(false)} onUpload={addDoc} />}
    </div>
  );
}
