import { Link, useLocation } from "react-router";
import { navByPath } from "../../lib/nav";
import { Icon } from "../../components/ui/Icon";
import { useTheme } from "../../hooks/useTheme";

interface TopbarProps {
  onMenu: () => void;
  onToggleSidebar: () => void;
}

export function Topbar({ onMenu, onToggleSidebar }: TopbarProps) {
  const { pathname } = useLocation();
  const { theme, toggleTheme } = useTheme();
  const current = navByPath[pathname];
  const title = current?.label ?? "Home";

  return (
    <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-line bg-paper-raised/85 px-5 py-3 backdrop-blur-md md:px-7">
      {/* mobile menu */}
      <button
        onClick={onMenu}
        aria-label="Open navigation"
        className="flex h-8.5 w-8.5 items-center justify-center rounded-[9px] border border-line text-ink-soft hover:bg-paper-sunken lg:hidden"
      >
        <Icon name="menu" className="h-4.25 w-4.25" />
      </button>

      {/* desktop sidebar collapse toggle */}
      <button
        onClick={onToggleSidebar}
        aria-label="Collapse sidebar"
        title="Collapse / expand sidebar"
        className="hidden h-8.5 w-8.5 items-center justify-center rounded-[9px] border border-line text-ink-soft hover:bg-paper-sunken lg:flex"
      >
        <Icon name="panel-left" className="h-4.25 w-4.25" />
      </button>

      {/* breadcrumb */}
      <div className="flex min-w-0 items-center gap-2">
        <span className="hidden text-[0.82rem] text-ink-faint sm:inline">Jadeite</span>
        <Icon name="chevron-right" className="hidden h-3.5 w-3.5 text-ink-faint sm:block" />
        <h1 className="truncate font-display text-[1.15rem] font-bold">{title}</h1>
      </div>

      <div className="flex-1" />

      {/* search (md+) */}
      <label className="hidden items-center gap-2 rounded-md border border-line bg-paper-sunken px-3 py-2 text-ink-soft focus-within:border-jade-500 md:flex">
        <Icon name="search" className="h-4 w-4" />
        <input
          type="search"
          aria-label="Search"
          placeholder="Search…"
          className="w-40 bg-transparent text-[0.83rem] placeholder:text-ink-faint focus:outline-none lg:w-52"
        />
      </label>

      {/* period pill */}
      <div className="hidden items-center gap-1.5 rounded-full border border-line bg-paper-sunken px-3 py-1.5 text-[0.8rem] font-medium sm:flex">
        <Icon name="calendar" className="h-3.5 w-3.5 text-ink-soft" />
        <span>Jan – Jun 2026</span>
      </div>

      {/* theme toggle */}
      <button
        onClick={toggleTheme}
        aria-label="Toggle theme"
        title="Switch light / dark"
        className="flex h-8.5 w-8.5 items-center justify-center rounded-[9px] border border-line text-ink-soft hover:bg-paper-sunken"
      >
        <Icon name={theme === "dark" ? "sun" : "moon"} className="h-4.25 w-4.25" />
      </button>

      {/* notifications — quick shortcut to the full Notifications page */}
      <Link
        to="/notifications"
        aria-label="Notifications"
        className="relative flex h-8.5 w-8.5 items-center justify-center rounded-md border border-line text-ink-soft hover:bg-paper-sunken"
      >
        <Icon name="bell" className="h-4.25 w-4.25" />
        <span className="absolute right-1.5 top-1.5 h-1.75 w-1.75 rounded-md border-[1.5px] border-paper-raised bg-critical" />
      </Link>

      {/* avatar — same signed-in user as the sidebar chip */}
      <Link
        to="/users"
        aria-label="Account — Yeamen Hossen"
        title="Yeamen Hossen"
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-gold-500 text-[0.72rem] font-bold text-jade-950 transition-[filter] hover:brightness-95"
      >
        YH
      </Link>
    </header>
  );
}
