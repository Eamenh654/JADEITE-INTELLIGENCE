/* ==================================================================
   §12C.5 Employee AI Workspace — role-aware assistant
   Local, canned response engine. Read-only, cites sources, no writes.
   ================================================================== */

export interface MsgMeta {
  company?: string;
  period?: string;
  sources?: string[];
  refreshed?: string;
}

export interface Message {
  id: string;
  role: "ai" | "user";
  /** Lead paragraph. */
  text: string;
  /** Supporting points, rendered as a list. */
  points?: string[];
  /** Highlighted recommendation or draft note under the points. */
  note?: string;
  /** Marks a reviewable draft that needs a separate authorized action. */
  draft?: boolean;
  meta?: MsgMeta;
}

/** The signed-in admin, used for the chat avatar. */
export const ME = { name: "Admin", initials: "AD" };

export interface Prompt {
  label: string;
  group: "Admin" | "Employee";
}

/** Prompt library from §12C.5 — the two request tables. */
export const prompts: Prompt[] = [
  { label: "Which company needs attention?", group: "Admin" },
  { label: "Why did sales fall this month?", group: "Admin" },
  { label: "Which campaigns should we review?", group: "Admin" },
  { label: "What is likely to happen next month?", group: "Admin" },
  { label: "What actions should we take?", group: "Admin" },
  { label: "Prepare my monthly review", group: "Admin" },
  { label: "Summarize what needs my attention", group: "Employee" },
  { label: "Help me improve my KPI", group: "Employee" },
  { label: "Prepare my weekly update", group: "Employee" },
  { label: "Find the relevant document", group: "Employee" },
  { label: "Draft an email or action plan", group: "Employee" },
];

export const seedConversation: Message[] = [
  {
    id: "seed-1",
    role: "ai",
    text: "Good morning. Portfolio revenue is $3.18M YTD, 8.2% ahead of plan. Amaq needs attention — marketing spend is 21.4% against a 20% cap. Ask me anything, and I'll cite the data behind every answer.",
    meta: { company: "Portfolio", period: "Jun 2026", sources: ["Shopify", "Financials"], refreshed: "22 min ago" },
  },
];

let counter = 0;
const nextId = () => `m-${Date.now()}-${counter++}`;

export function userMessage(text: string): Message {
  return { id: nextId(), role: "user", text };
}

type Reply = Omit<Message, "id" | "role">;

/** Keyword-matched canned replies. First match wins. */
const intents: { test: (q: string) => boolean; reply: Reply }[] = [
  {
    test: (q) => /summar|my attention|what needs|need my/.test(q),
    reply: {
      text: "Here's what needs you today:",
      points: [
        "2 approvals waiting — Q2 bonus batch and the June e-commerce lock.",
        "1 overdue task — reconnect Camel Glow TikTok Ads.",
        "1 KPI gap — Amaq retention 24.1% vs 30% target.",
        "2 alerts — Amaq marketing spend cap, Qynda stockout risk.",
      ],
      meta: { company: "Portfolio", period: "Jun 2026", sources: ["Tasks", "KPIs", "Approvals"], refreshed: "just now" },
    },
  },
  {
    test: (q) => /which company|needs attention|attention\??$|who needs/.test(q),
    reply: {
      text: "Amaq needs attention most — Growth stage, 45% Jadeite equity.",
      points: [
        "Marketing spend 21.4% vs the 20% approved cap — 2 of the last 3 months.",
        "Customer retention 24.1% vs a 30% target — 80% achievement.",
        "Meta campaign “Glow-Reset” ROAS 1.9x, below the 3.0x threshold.",
      ],
      note: "Recommended: pause “Glow-Reset” for a creative review and flag the spend-cap breach to Finance.",
      meta: { company: "Amaq", period: "Jun 2026", sources: ["Shopify", "Meta Ads"], refreshed: "22 min ago" },
    },
  },
  {
    test: (q) => /sales (fall|fell|drop|down)|why.*(sales|revenue)|revenue (fall|fell|drop)/.test(q),
    reply: {
      text: "Qynda's February gross sales were $178,900 vs a $195,000 target (−8.3%). This reads as an inventory issue, not a demand issue.",
      points: [
        "Conversion rate dropped to 1.88% from 2.15% in January.",
        "The Cooldown Coat stockout (Slate/M) removed the top-converting SKU from paid traffic for 9 days.",
        "Marketing spend was flat month-on-month.",
      ],
      meta: { company: "Qynda", period: "Feb 2026", sources: ["Shopify", "Inventory feed"], refreshed: "1 h ago" },
    },
  },
  {
    test: (q) => /campaign|glow-?reset|roas|ad ?set/.test(q),
    reply: {
      text: "Three campaigns are worth a review this period — weak ROAS or unreliable attribution:",
      points: [
        "Amaq · “Glow-Reset” (Meta) — ROAS 1.9x vs 3.0x threshold; conversion declining.",
        "Camel Glow · TikTok Awareness — spend running blind since the token expired 26h ago.",
        "Amaq · Google PMax — currently paused; reassess before restarting.",
      ],
      note: "Recommended: pause “Glow-Reset” for a creative refresh, and reconnect TikTok before trusting Camel Glow ROAS.",
      meta: { company: "Portfolio", period: "Jun 2026", sources: ["Meta Ads", "Google Ads", "TikTok Ads", "Shopify"], refreshed: "22 min ago" },
    },
  },
  {
    test: (q) => /next month|forecast|likely|predict|expect|outlook/.test(q),
    reply: {
      text: "On the current run-rate, portfolio online revenue lands around $560K–$605K in July (base case ≈ $585K).",
      points: [
        "Qynda: steady, but a hero-SKU stockout could cap orders by ~5% if not reordered.",
        "Amaq: softening — tightening spend to the cap should stabilise CAC.",
        "Camel Glow: uncertain until TikTok attribution is restored.",
      ],
      note: "Confidence is moderate. The forecast uses 6 months of history; the range widens while the TikTok and reorder issues are open.",
      meta: { company: "Portfolio", period: "Jul 2026 · forecast", sources: ["Shopify", "Ad platforms"], refreshed: "2 h ago" },
    },
  },
  {
    test: (q) => /draft|email|action plan|write a|compose/.test(q),
    reply: {
      text: "Draft email to the Amaq marketing lead:",
      points: [
        "Subject: Glow-Reset — pause for creative review.",
        "Body: Glow-Reset ROAS is 1.9x against our 3.0x threshold and spend is over the 20% cap. Let's pause it, refresh the creative, and re-launch once the hook rate improves.",
      ],
      draft: true,
      note: "Draft only — sending or changing records needs a separate authorized action.",
      meta: { company: "Amaq", period: "Jun 2026", sources: ["Meta Ads"], refreshed: "22 min ago" },
    },
  },
  {
    test: (q) => /action|what should we|what to do|recommend/.test(q),
    reply: {
      text: "Recommended actions, highest impact first:",
      points: [
        "Reorder the Qynda hero SKU before the reorder point (~9 days).",
        "Reconnect Camel Glow TikTok Ads to restore attribution.",
        "Pause Amaq “Glow-Reset” for a creative review.",
        "Flag Amaq's marketing spend-cap breach to Finance.",
      ],
      note: "Each can become a task with an owner — the final decision stays with you.",
      meta: { company: "Portfolio", period: "Jun 2026", sources: ["Shopify", "Meta Ads", "TikTok Ads"], refreshed: "22 min ago" },
    },
  },
  {
    test: (q) => /monthly review|month.?end|management summary/.test(q),
    reply: {
      text: "Here's a draft management summary for June 2026:",
      points: [
        "Performance: portfolio revenue $3.18M YTD, 8.2% ahead of plan.",
        "Risks: Amaq spend-cap breach; Camel Glow attribution gap; Qynda stockout risk.",
        "Decisions pending: 1 bonus batch, 1 monthly e-commerce lock.",
        "Actions: reorder, reconnect TikTok, review Glow-Reset creative.",
      ],
      draft: true,
      note: "Draft — review and edit before saving it to the monthly report.",
      meta: { company: "Portfolio", period: "Jun 2026", sources: ["Shopify", "Financials", "Ad platforms"], refreshed: "22 min ago" },
    },
  },
  {
    test: (q) => /weekly update|weekly|this week/.test(q),
    reply: {
      text: "Draft weekly update:",
      points: [
        "Done: locked May e-commerce figures; refreshed Meta creative for Qynda.",
        "Risks: Camel Glow attribution gap; Amaq ROAS below target.",
        "Next: reorder Qynda hero SKU; review Glow-Reset creative.",
      ],
      draft: true,
      note: "Draft — edit before sending.",
      meta: { company: "Portfolio", period: "This week", sources: ["Tasks", "Shopify"], refreshed: "just now" },
    },
  },
  {
    test: (q) => /kpi|target|retention|improve my/.test(q),
    reply: {
      text: "Your closest gap is customer retention on Amaq — 24.1% vs a 30% target (80% achievement).",
      points: [
        "Strengthen the post-purchase email flow — it drives most repeat orders.",
        "Prioritise the subscription offer for first-time buyers.",
        "Win back lapsed customers from the March cohort with a targeted offer.",
      ],
      note: "This uses approved data only. Want it drafted as an action plan?",
      meta: { company: "Amaq", period: "Jun 2026", sources: ["Shopify"], refreshed: "1 h ago" },
    },
  },
  {
    test: (q) => /document|find.*(doc|file|report|agreement)|where is|search/.test(q),
    reply: {
      text: "I found 2 approved documents matching that:",
      points: [
        "“Qynda supplier agreement 2026.pdf” — Documents · Qynda.",
        "“June marketing plan — Amaq.docx” — Documents · Amaq.",
      ],
      note: "I only searched documents you're permitted to see. Open either from the Document library.",
      meta: { company: "Portfolio", period: "—", sources: ["Documents"], refreshed: "just now" },
    },
  },
];

const fallback: Reply = {
  text: "I can help with that using only the data you're permitted to see — I'll pull the latest figures, cite the sources, and flag any limitations. I won't change anything without your approval.",
  note: "Try a suggestion below, or ask about performance, KPIs, campaigns, documents, or a summary.",
  meta: { company: "Portfolio", period: "Jun 2026", sources: ["Shopify", "Ad platforms"], refreshed: "just now" },
};

export function respond(input: string): Message {
  const q = input.toLowerCase();
  const match = intents.find((i) => i.test(q));
  const reply = match?.reply ?? fallback;
  return { id: nextId(), role: "ai", ...reply };
}
