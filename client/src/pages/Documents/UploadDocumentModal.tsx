import { useEffect, useState } from "react";
import { Button } from "../../components/ui/Button";
import { Icon } from "../../components/ui/Icon";
import { categories, financeCompanies, type Access, type Doc, type DocCategory } from "./data";

interface UploadProps {
  onClose: () => void;
  onUpload: (doc: Doc) => void;
}

const fieldClass =
  "w-full rounded-md border border-line bg-paper-sunken px-3 py-2.5 text-[0.86rem] text-ink placeholder:text-ink-faint focus:border-jade-500 focus:outline-none";
const labelClass =
  "mb-1.5 block text-[0.74rem] font-semibold uppercase tracking-[0.06em] text-ink-faint";

export function UploadDocumentModal({ onClose, onUpload }: UploadProps) {
  const [name, setName] = useState("");
  const [companyId, setCompanyId] = useState<string>("");
  const [category, setCategory] = useState<DocCategory>("financial");
  const [owner, setOwner] = useState("");
  const [access, setAccess] = useState<Access>("all");

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const canUpload = name.trim() !== "";

  const upload = () => {
    onUpload({
      id: `doc-${Date.now()}`,
      name: name.trim(),
      companyId: companyId || null,
      category,
      owner: owner.trim() || "Unassigned",
      version: 1,
      updated: "Just now",
      expiryDays: null,
      access,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <button aria-label="Close" onClick={onClose} className="absolute inset-0 bg-jade-950/45 backdrop-blur-sm" />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Upload document"
        className="relative flex max-h-[92vh] w-full max-w-xl flex-col overflow-hidden rounded-t-2xl border border-line bg-paper-raised shadow-(--shadow-lg) sm:rounded-2xl"
      >
        <div className="flex items-center justify-between gap-3 border-b border-line-soft px-5 py-4">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-jade-100 text-jade-600">
              <Icon name="upload" className="h-4.5 w-4.5" strokeWidth={1.7} />
            </span>
            <div>
              <p className="font-display text-[0.78rem] font-medium italic text-gold-600">Records</p>
              <h2 className="font-display text-[1.15rem] font-bold leading-tight">Upload document</h2>
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

        <div className="thin-scroll min-h-0 flex-1 overflow-y-auto p-5">
          <div className="flex flex-col gap-4">
            {/* drop zone (visual) */}
            <div className="flex flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-line bg-paper-sunken px-4 py-6 text-center">
              <Icon name="upload" className="h-6 w-6 text-ink-faint" />
              <p className="text-[0.82rem] font-semibold">Drag a file here, or browse</p>
              <p className="text-[0.74rem] text-ink-faint">PDF, DOCX or XLSX up to 25 MB</p>
            </div>

            <div>
              <label className={labelClass} htmlFor="d-name">Document name</label>
              <input id="d-name" className={fieldClass} placeholder="e.g. June 2026 P&L Statement" value={name} onChange={(e) => setName(e.target.value)} autoFocus />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={labelClass} htmlFor="d-company">Company</label>
                <select id="d-company" className={fieldClass} value={companyId} onChange={(e) => setCompanyId(e.target.value)}>
                  <option value="">All / portfolio</option>
                  {financeCompanies.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass} htmlFor="d-category">Category</label>
                <select id="d-category" className={fieldClass} value={category} onChange={(e) => setCategory(e.target.value as DocCategory)}>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={labelClass} htmlFor="d-owner">Owner</label>
                <input id="d-owner" className={fieldClass} placeholder="e.g. Finance" value={owner} onChange={(e) => setOwner(e.target.value)} />
              </div>
              <div>
                <p className={labelClass}>Access</p>
                <div className="grid grid-cols-2 gap-2">
                  {(["all", "restricted"] as Access[]).map((a) => (
                    <button
                      key={a}
                      onClick={() => setAccess(a)}
                      className={`rounded-lg border px-1 py-2 text-[0.76rem] font-semibold capitalize transition-colors ${
                        access === a
                          ? "border-jade-500 bg-jade-100 text-jade-700"
                          : "border-line bg-paper-raised text-ink-soft hover:bg-paper-sunken"
                      }`}
                    >
                      {a === "all" ? "All access" : "Restricted"}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2.5 border-t border-line-soft px-5 py-3.5">
          <Button variant="ghost" size="md" onClick={onClose}>Cancel</Button>
          <Button variant="primary" size="md" icon="upload" disabled={!canUpload} onClick={upload}>
            Upload
          </Button>
        </div>
      </div>
    </div>
  );
}
