import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router";
import { Logo } from "../../components/Logo";
import { Icon } from "../../components/ui/Icon";
import { Button } from "../../components/ui/Button";
import { useTheme } from "../../hooks/useTheme";

const HIGHLIGHTS = [
  "Portfolio-wide revenue, profit & KPI intelligence",
  "Approvals, bonuses and tasks in one workflow",
  "Role-based access for Management, Finance & HR",
];

export default function Login() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [email, setEmail] = useState("admin@jadeiteventures.com");
  const [password, setPassword] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    // Static prototype — go straight to the dashboard.
    navigate("/");
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-[1.05fr_1fr]">
      {/* ---------- Brand panel ---------- */}
      <aside className="bg-brand-panel relative hidden flex-col justify-between overflow-hidden p-12 text-[#EAF3EC] lg:flex">
        {/* decorative rings */}
        <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full border border-white/10" />
        <div className="pointer-events-none absolute -bottom-32 -left-20 h-80 w-80 rounded-full border border-white/[0.07]" />

        <div className="relative flex items-center gap-3">
          <Logo size="lg" />
          <div className="leading-tight">
            <p className="font-display text-[1.05rem] font-bold tracking-wide text-white">
              JADEITE
            </p>
            <p className="text-[0.62rem] uppercase tracking-[0.28em] text-white/55">
              Intelligence Hub
            </p>
          </div>
        </div>

        <div className="relative max-w-md">
          <p className="font-display text-[1.4rem] font-light italic text-gold-500">Elevating</p>
          <h2 className="font-display text-[2.6rem] font-bold uppercase leading-[1.05] tracking-[0.02em] text-white text-shadow-soft">
            The Standard
          </h2>
          <p className="mt-4 max-w-sm text-[0.92rem] leading-relaxed text-[#EAF3EC]/70">
            One command center for the entire Jadeite Ventures portfolio — companies,
            people, performance and cash, together.
          </p>

          <ul className="mt-8 flex flex-col gap-3">
            {HIGHLIGHTS.map((h) => (
              <li key={h} className="flex items-start gap-3 text-[0.88rem] text-[#EAF3EC]/85">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-jade-600/60">
                  <Icon name="shield-check" className="h-3.5 w-3.5 text-white" strokeWidth={1.8} />
                </span>
                {h}
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-[0.72rem] text-[#EAF3EC]/45">
          Jadeite Intelligence Hub · Internal platform · Prototype build
        </p>
      </aside>

      {/* ---------- Form panel ---------- */}
      <main className="bg-aura relative flex flex-col items-center justify-center px-6 py-12">
        {/* theme toggle */}
        <button
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className="absolute right-6 top-6 flex h-9 w-9 items-center justify-center rounded-md border border-line bg-paper-raised text-ink-soft hover:bg-paper-sunken"
        >
          <Icon name={theme === "dark" ? "sun" : "moon"} className="h-4.5 w-4.5" />
        </button>

        <div className="w-full max-w-100">
          {/* mobile brand */}
          <div className="mb-7 flex flex-col items-center gap-2 lg:hidden">
            <Logo size="md" />
            <p className="font-display text-[1.05rem] font-light italic text-gold-600">Elevating</p>
            <p className="-mt-1 font-display text-[0.95rem] font-bold uppercase tracking-widest">
              The Standard
            </p>
          </div>

          <div className="rounded-2xl border border-line bg-paper-raised p-8 shadow-(--shadow-lg) sm:p-9">
            <h1 className="font-display text-[1.5rem] font-bold">Sign in to Intelligence Hub</h1>
            <p className="mt-1 text-[0.88rem] text-ink-soft">
              Welcome back. Use your Jadeite work account.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
              <Field label="Work email" htmlFor="email">
                <input
                  id="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-line bg-paper-raised px-3 py-2.5 text-[0.9rem] outline-none transition-colors focus:border-jade-500"
                />
              </Field>

              <Field
                label="Password"
                htmlFor="password"
                aside={
                  <a href="#" className="text-[0.74rem] font-semibold text-jade-600 hover:underline">
                    Forgot password?
                  </a>
                }
              >
                <input
                  id="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-line bg-paper-raised px-3 py-2.5 text-[0.9rem] outline-none transition-colors placeholder:text-ink-faint focus:border-jade-500"
                />
              </Field>

              <label className="flex select-none items-center gap-2 text-[0.82rem] text-ink-soft">
                <input
                  type="checkbox"
                  defaultChecked
                  className="h-4 w-4 rounded border-line accent-jade-600"
                />
                Keep me signed in on this device
              </label>

              <Button type="submit" className="mt-1 w-full">
                Sign in to Intelligence Hub
              </Button>
            </form>

            <div className="mt-5 flex gap-2 rounded-md border border-jade-100 bg-jade-50 p-3 text-[0.76rem] text-jade-600">
              <Icon name="shield-check" className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={1.7} />
              <p>
                Multi-factor authentication is required for Management, Finance, HR and
                System Admin roles.
              </p>
            </div>
          </div>

          <p className="mt-5 text-center text-[0.72rem] text-ink-faint">
            Protected internal platform · © 2026 Jadeite Ventures
          </p>
        </div>
      </main>
    </div>
  );
}

function Field({
  label,
  htmlFor,
  aside,
  children,
}: {
  label: string;
  htmlFor: string;
  aside?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <label htmlFor={htmlFor} className="text-[0.74rem] font-semibold text-ink-soft">
          {label}
        </label>
        {aside}
      </div>
      {children}
    </div>
  );
}
