/** Audit coverage areas (§15 audit coverage table). */
export type AuditArea = "people" | "performance" | "compensation" | "financials" | "operations";

export const auditAreas: { id: AuditArea; label: string; examples: string }[] = [
  { id: "people", label: "People", examples: "Employee records, role changes and access" },
  { id: "performance", label: "Performance", examples: "KPIs, targets, actuals, reviews and appeals" },
  { id: "compensation", label: "Compensation", examples: "Bonus calculations, adjustments, approvals, payments" },
  { id: "financials", label: "Financials", examples: "Statements, imports, approvals and equity %" },
  { id: "operations", label: "Operations", examples: "Tasks, documents, company status and settings" },
];

export const areaLabel: Record<AuditArea, string> = {
  people: "People",
  performance: "Performance",
  compensation: "Compensation",
  financials: "Financials",
  operations: "Operations",
};

export interface AuditEntry {
  id: string;
  when: string;
  who: string;
  action: string;
  item: string;
  area: AuditArea;
  /** Previous → new value, when the action changed a stored value. */
  from?: string;
  to?: string;
  reason: string;
}

export const auditLog: AuditEntry[] = [
  { id: "au1", when: "Jul 19, 4:02 PM", who: "Admin", action: "Approved", item: "Amaq April bonus payment", area: "compensation", reason: "Cash confirmed" },
  { id: "au2", when: "Jul 18, 11:20 AM", who: "Ravi Khanna", action: "Submitted", item: "Amaq June financials", area: "financials", reason: "Monthly close" },
  { id: "au3", when: "Jul 17, 2:45 PM", who: "Admin", action: "Overrode status", item: "Amaq — company status", area: "operations", from: "On Track", to: "Watch", reason: "Marketing spend cap exceeded" },
  { id: "au4", when: "Jul 15, 9:10 AM", who: "System", action: "Access granted (temporary)", item: "External Auditor — Qynda Financials", area: "people", reason: "Annual audit, expires Aug 3" },
  { id: "au5", when: "Jul 14, 3:30 PM", who: "Admin", action: "Updated KPI target", item: "Amaq — Customer Retention", area: "performance", from: "28%", to: "30%", reason: "Board-approved uplift" },
  { id: "au6", when: "Jul 12, 10:05 AM", who: "HR", action: "Adjusted bonus", item: "D. Osei — Q2", area: "compensation", from: "$4,200", to: "$4,600", reason: "Corrected KPI weighting" },
  { id: "au7", when: "Jul 9, 6:12 PM", who: "Admin", action: "Changed equity", item: "Amaq — Jadeite ownership", area: "financials", from: "40%", to: "45%", reason: "New investment round" },
  { id: "au8", when: "Jul 7, 1:40 PM", who: "Admin", action: "Granted access", item: "R. Khanna — Amaq Financials", area: "people", reason: "Role assignment" },
  { id: "au9", when: "Jul 5, 8:55 AM", who: "System", action: "Document uploaded", item: "Qynda — June P&L Statement", area: "operations", reason: "Finance upload" },
  { id: "au10", when: "Jul 3, 4:20 PM", who: "N. Farrow", action: "Filed KPI appeal", item: "Amaq — Customer Retention", area: "performance", reason: "Disputed June segmentation" },
];
