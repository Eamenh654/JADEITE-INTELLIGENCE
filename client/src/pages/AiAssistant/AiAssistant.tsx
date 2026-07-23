import { useEffect, useRef, useState } from "react";
import { Card } from "../../components/ui/Card";
import { Pill } from "../../components/ui/Pill";
import { Button } from "../../components/ui/Button";
import { Icon } from "../../components/ui/Icon";
import {
  ME,
  prompts,
  respond,
  seedConversation,
  userMessage,
  type Message,
} from "./data";

function MetaLine({ meta }: { meta: NonNullable<Message["meta"]> }) {
  return (
    <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.72rem]">
      {meta.company && (
        <span className="text-ink-faint">
          Company: <span className="font-semibold text-ink-soft">{meta.company}</span>
        </span>
      )}
      {meta.period && (
        <span className="text-ink-faint">
          Period: <span className="font-semibold text-ink-soft">{meta.period}</span>
        </span>
      )}
      {meta.sources && meta.sources.length > 0 && (
        <span className="inline-flex items-center gap-1.5">
          <span className="text-ink-faint">Sources:</span>
          {meta.sources.map((s) => (
            <span key={s} className="rounded-md bg-paper-raised px-1.5 py-0.5 text-[0.68rem] font-semibold text-ink-soft">
              {s}
            </span>
          ))}
        </span>
      )}
      {meta.refreshed && <span className="text-ink-faint">Refreshed {meta.refreshed}</span>}
    </div>
  );
}

function MessageRow({ m }: { m: Message }) {
  const isAi = m.role === "ai";
  return (
    <div className={`flex items-start gap-3 ${isAi ? "" : "flex-row-reverse"}`}>
      <span
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[0.68rem] font-bold ${
          isAi ? "bg-jade-600 text-white" : "border border-line bg-paper-raised text-ink-soft"
        }`}
      >
        {isAi ? "AI" : ME.initials}
      </span>

      <div className={`min-w-0 max-w-[85%] ${isAi ? "" : "flex flex-col items-end"}`}>
        <div
          className={`rounded-2xl px-4 py-3 text-[0.86rem] leading-relaxed ${
            isAi ? "rounded-tl-sm bg-paper-sunken text-ink" : "rounded-tr-sm bg-jade-600 text-white"
          }`}
        >
          {m.draft && (
            <span className="mb-1.5 inline-flex items-center gap-1 rounded-md bg-gold-100 px-1.5 py-0.5 text-[0.64rem] font-bold uppercase tracking-wide text-gold-700">
              <Icon name="sparkle" className="h-3 w-3" /> Draft
            </span>
          )}
          <p>{m.text}</p>
          {m.points && (
            <ul className="mt-2 flex flex-col gap-1.5">
              {m.points.map((p, i) => (
                <li key={i} className="flex gap-2">
                  <span className={`mt-1.75 h-1.5 w-1.5 shrink-0 rounded-full ${isAi ? "bg-jade-500" : "bg-white/70"}`} />
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          )}
          {m.note && (
            <p className={`mt-2.5 border-t pt-2.5 text-[0.82rem] font-medium ${isAi ? "border-line text-jade-700" : "border-white/25 text-white"}`}>
              {m.note}
            </p>
          )}
        </div>
        {isAi && m.meta && <MetaLine meta={m.meta} />}
      </div>
    </div>
  );
}

function TypingRow() {
  return (
    <div className="flex items-start gap-3">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-jade-600 text-[0.68rem] font-bold text-white">
        AI
      </span>
      <div className="flex items-center gap-1 rounded-2xl rounded-tl-sm bg-paper-sunken px-4 py-3.5">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="h-1.5 w-1.5 animate-bounce rounded-full bg-ink-faint"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
    </div>
  );
}

export default function AiAssistant() {
  const [messages, setMessages] = useState<Message[]>(seedConversation);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, pending]);

  useEffect(() => () => void (timer.current && clearTimeout(timer.current)), []);

  const send = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || pending) return;
    setMessages((prev) => [...prev, userMessage(trimmed)]);
    setInput("");
    setPending(true);
    timer.current = setTimeout(() => {
      setMessages((prev) => [...prev, respond(trimmed)]);
      setPending(false);
    }, 650);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* head */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-display text-[0.82rem] font-medium italic text-gold-600">AI Workspace</p>
          <h2 className="mt-0.5 font-display text-[1.6rem] font-bold">AI Assistant</h2>
          <p className="mt-0.5 text-[0.85rem] text-ink-soft">
            Role-aware analysis using only the data you're permitted to see. Recommendations require your approval.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Pill tone="info" dot={false}>
            <Icon name="users" className="h-3.5 w-3.5" /> Admin
          </Pill>
          <Pill tone="neutral" dot={false}>Full portfolio</Pill>
          <Pill tone="good">
            <Icon name="lock" className="h-3.5 w-3.5" /> Read-only
          </Pill>
        </div>
      </div>

      {/* chat */}
      <Card className="flex flex-col overflow-hidden">
        <div ref={scrollRef} className="thin-scroll flex max-h-[58vh] min-h-[320px] flex-col gap-5 overflow-y-auto p-5">
          {messages.map((m) => (
            <MessageRow key={m.id} m={m} />
          ))}
          {pending && <TypingRow />}
        </div>

        {/* suggestions */}
        <div className="thin-scroll flex gap-2 overflow-x-auto border-t border-line-soft px-4 py-3">
          {prompts.map((p) => (
            <button
              key={p.label}
              onClick={() => send(p.label)}
              disabled={pending}
              className="whitespace-nowrap rounded-full border border-line bg-paper-raised px-3 py-1.5 text-[0.78rem] font-medium text-ink-soft transition-colors hover:bg-paper-sunken disabled:opacity-50"
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* input */}
        <div className="flex items-center gap-2.5 border-t border-line-soft p-3">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), send(input))}
            placeholder="Ask about performance, KPIs, campaigns, or draft a summary…"
            className="min-w-0 flex-1 rounded-lg border border-line bg-paper-sunken px-3.5 py-2.5 text-[0.86rem] text-ink placeholder:text-ink-faint focus:border-jade-500 focus:outline-none"
            aria-label="Message the AI assistant"
          />
          <Button variant="primary" size="md" icon="chevron-right" disabled={!input.trim() || pending} onClick={() => send(input)}>
            Send
          </Button>
        </div>
      </Card>

      {/* safeguard note */}
      <p className="flex items-start gap-2 rounded-xl border border-line bg-paper-raised px-4 py-3 text-[0.8rem] text-ink-soft">
        <Icon name="shield-check" className="mt-0.5 h-4.25 w-4.25 shrink-0 text-jade-600" />
        AI is read-only by default. It cannot change campaigns, targets, KPIs, bonuses, financial records or equity
        information without a person taking a separate approved action. Every answer shows the company, period, data
        sources and last refresh — you can open the underlying dashboard behind any finding.
      </p>
    </div>
  );
}
