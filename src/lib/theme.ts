export type Theme = "light" | "dark";

const STORAGE_KEY = "jadeite-theme";

/** The theme the user explicitly chose, or null if they haven't picked one. */
export function getStoredTheme(): Theme | null {
  const v = localStorage.getItem(STORAGE_KEY);
  return v === "light" || v === "dark" ? v : null;
}

/** Active theme. Defaults to light until the user switches. */
export function getActiveTheme(): Theme {
  return getStoredTheme() ?? "light";
}

export function applyTheme(theme: Theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem(STORAGE_KEY, theme);
}

/** Pin the initial theme on the <html> element (called once at startup so a
 *  dark-OS visitor still gets the light default until they toggle). */
export function initTheme() {
  document.documentElement.setAttribute("data-theme", getActiveTheme());
}

export function toggleTheme(): Theme {
  const next: Theme = getActiveTheme() === "dark" ? "light" : "dark";
  applyTheme(next);
  return next;
}
