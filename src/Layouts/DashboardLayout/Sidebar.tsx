import { NavLink } from "react-router";
import { navGroups } from "../../lib/nav";
import { Logo } from "../../components/Logo";
import { Icon } from "../../components/ui/Icon";

interface SidebarProps {
  /** Mobile drawer open state. */
  open: boolean;
  /** Desktop collapsed (icon-rail) state. */
  collapsed: boolean;
  /** True when the drawer is translated off-screen — remove it from the a11y tree. */
  offscreen?: boolean;
  onNavigate: () => void;
}

export function Sidebar({ open, collapsed, offscreen = false, onNavigate }: SidebarProps) {
  // Collapse styling only kicks in from `lg` up — the mobile drawer is always full.
  const hideOnCollapse = collapsed ? "lg:hidden" : "";
  const showOnCollapse = collapsed ? "hidden lg:block" : "hidden";

  return (
    <>
      {/* mobile scrim */}
      <div
        onClick={onNavigate}
        className={`fixed inset-0 z-40 bg-jade-950/50 backdrop-blur-sm transition-opacity lg:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <aside
        aria-label="Primary"
        aria-hidden={offscreen || undefined}
        inert={offscreen}
        className={`bg-sidebar fixed inset-y-0 left-0 z-50 flex h-screen w-62 flex-col text-[#EAF3EC] transition-[width,transform] duration-300 lg:z-40 lg:translate-x-0 ${
          collapsed ? "lg:w-20" : "lg:w-62"
        } ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Brand */}
        <div
          className={`flex flex-col items-center gap-2 px-5 pb-4 pt-6 ${
            collapsed ? "lg:px-2" : ""
          }`}
        >
          <Logo size="lg" />
          <span
            className={`font-display text-[0.62rem] font-medium uppercase tracking-[0.28em] text-white/55 ${hideOnCollapse}`}
          >
            Intelligence Hub
          </span>
        </div>

        {/* Nav */}
        <nav
          className={`hide-scroll flex-1 overflow-y-auto px-3 pb-3 pt-1 ${
            collapsed ? "lg:px-2" : ""
          }`}
        >
          {navGroups.map((group, gi) => (
            <div key={group.label ?? `g${gi}`}>
              {group.label && (
                <>
                  <p
                    className={`px-2.5 pb-1.5 pt-3.5 text-[0.66rem] font-medium uppercase tracking-[0.12em] text-[#EAF3EC]/40 ${hideOnCollapse}`}
                  >
                    {group.label}
                  </p>
                  {/* thin divider stands in for the label when collapsed */}
                  <div className={`mx-2 my-2 h-px bg-white/10 ${showOnCollapse}`} />
                </>
              )}
              <ul className="flex flex-col gap-0.5">
                {group.items.map((item) => (
                  <li key={item.to}>
                    <NavLink
                      to={item.to}
                      end={item.end}
                      onClick={onNavigate}
                      title={collapsed ? item.label : undefined}
                      className={({ isActive }) =>
                        `group relative flex items-center gap-2.5 rounded-md px-2.5 py-2 text-[0.87rem] font-medium transition-colors ${
                          collapsed ? "lg:justify-center lg:px-0" : ""
                        } ${
                          isActive
                            ? "bg-jade-600 text-white shadow-(--shadow-sm)"
                            : "text-[#EAF3EC]/75 hover:bg-white/6 hover:text-white"
                        }`
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <Icon
                            name={item.icon}
                            className={`h-4.25 w-4.25 shrink-0 ${
                              isActive ? "opacity-100" : "opacity-80"
                            }`}
                          />
                          <span className={`truncate ${hideOnCollapse}`}>{item.label}</span>
                          {item.flag && (
                            <>
                              {/* inline dot when expanded */}
                              {/* <span
                                className={`ml-auto h-1.75 w-1.75 shrink-0 rounded-full bg-gold-500 ${hideOnCollapse}`}
                              /> */}
                              {/* corner dot when collapsed */}
                              {/* <span
                                className={`absolute right-1.5 top-1.5 h-1.75 w-1.75 rounded-full bg-gold-500 ${showOnCollapse}`}
                              /> */}
                            </>
                          )}
                        </>
                      )}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        {/* User chip */}
        <div className="border-t border-white/10 p-3">
          <NavLink
            to="/users"
            onClick={onNavigate}
            title={collapsed ? "Yeamen Hossen" : undefined}
            className={`flex items-center gap-2.5 rounded-xl p-2 transition-colors hover:bg-white/6 ${
              collapsed ? "lg:justify-center" : ""
            }`}
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gold-500 text-[0.72rem] font-bold text-jade-950">
              YH
            </span>
            <span className={`min-w-0 text-left ${hideOnCollapse}`}>
              <span className="block truncate text-[0.82rem] font-semibold text-white">
                Yeamen Hossen
              </span>
              <span className="block truncate text-[0.7rem] text-[#EAF3EC]/55">
                Jadeite Management
              </span>
            </span>
            <Icon
              name="logout"
              className={`ml-auto h-4 w-4 shrink-0 text-[#EAF3EC]/45 ${hideOnCollapse}`}
            />
          </NavLink>
        </div>
      </aside>
    </>
  );
}
