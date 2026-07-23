import { useCallback, useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { useMediaQuery } from "../../hooks/useMediaQuery";

const COLLAPSE_KEY = "jadeite-sidebar-collapsed";

export default function DashboardLayout() {
  const [navOpen, setNavOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(
    () => localStorage.getItem(COLLAPSE_KEY) === "1",
  );
  const { pathname } = useLocation();
  // The sidebar is a permanent rail from `lg` up; below that it's a drawer.
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  // Close the mobile drawer whenever the route changes.
  useEffect(() => setNavOpen(false), [pathname]);

  // While the drawer is open: close on Escape and lock background scroll.
  useEffect(() => {
    if (!navOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setNavOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [navOpen]);

  const toggleCollapsed = useCallback(() => {
    setCollapsed((c) => {
      const next = !c;
      localStorage.setItem(COLLAPSE_KEY, next ? "1" : "0");
      return next;
    });
  }, []);

  return (
    <div className="min-h-screen bg-paper">
      <Sidebar
        open={navOpen}
        collapsed={collapsed}
        onNavigate={() => setNavOpen(false)}
        // Hidden off-screen drawer must not trap keyboard / screen-reader focus.
        offscreen={!isDesktop && !navOpen}
      />

      {/* Content is offset by the fixed sidebar's width on desktop. */}
      <div
        className={`flex min-h-screen flex-col transition-[padding] duration-300 ${
          collapsed ? "lg:pl-20" : "lg:pl-62"
        }`}
      >
        <Topbar onMenu={() => setNavOpen(true)} onToggleSidebar={toggleCollapsed} />
        <main className="mx-auto w-full max-w-340 flex-1 px-5 pb-16 pt-6 md:px-7">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
