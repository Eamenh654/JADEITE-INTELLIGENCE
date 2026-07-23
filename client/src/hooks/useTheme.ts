import { useCallback, useState } from "react";
import { getActiveTheme, toggleTheme as toggle, type Theme } from "../lib/theme";

/** Tracks the active theme (light by default) and toggles between light/dark. */
export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => getActiveTheme());
  const toggleTheme = useCallback(() => setTheme(toggle()), []);
  return { theme, toggleTheme };
}
