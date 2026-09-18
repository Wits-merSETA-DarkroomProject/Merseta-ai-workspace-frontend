import { useEffect, useState } from "react";

export type ThemeMode = "light" | "dark";

export const THEME_STORAGE_KEY = "mersia_theme_v1";

/**
 * Returns the currently stored theme mode.
 * Defaults to "dark" if no preference has been recorded.
 */
export function getStoredTheme(): ThemeMode {
  if (typeof window === "undefined") return "dark";
  try {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === "light") return "light";
    return "dark";
  } catch {
    return "dark";
  }
}

/**
 * Persists theme mode to localStorage, updates document root classes,
 * and notifies subscribers via a custom event.
 */
export function setStoredTheme(theme: ThemeMode): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Storage access may be restricted
  }
  applyThemeToDocument(theme);
  window.dispatchEvent(new CustomEvent("mersia-theme-change", { detail: { theme } }));
}

/**
 * Toggles between "light" and "dark", persists change, and returns the new mode.
 */
export function toggleStoredTheme(): ThemeMode {
  const current = getStoredTheme();
  const next: ThemeMode = current === "dark" ? "light" : "dark";
  setStoredTheme(next);
  return next;
}

/**
 * Synchronizes HTML document element classes.
 * Dark is root default; `.light` is added only when theme is "light".
 */
export function applyThemeToDocument(theme?: ThemeMode): void {
  if (typeof window === "undefined") return;
  const activeTheme = theme || getStoredTheme();
  const root = document.documentElement;

  if (activeTheme === "light") {
    root.classList.add("light");
    root.setAttribute("data-theme", "light");
  } else {
    root.classList.remove("light");
    root.setAttribute("data-theme", "dark");
  }
}

/**
 * React hook to reactively subscribe to merSIA theme changes.
 */
export function useTheme() {
  const [theme, setTheme] = useState<ThemeMode>(getStoredTheme);

  useEffect(() => {
    // Ensure document classes are in sync on mount
    applyThemeToDocument(theme);

    const handleThemeChange = (e: Event) => {
      const customEvent = e as CustomEvent<{ theme: ThemeMode }>;
      if (customEvent.detail?.theme) {
        setTheme(customEvent.detail.theme);
      } else {
        setTheme(getStoredTheme());
      }
    };

    const handleStorage = (e: StorageEvent) => {
      if (e.key === THEME_STORAGE_KEY) {
        const next = getStoredTheme();
        setTheme(next);
        applyThemeToDocument(next);
      }
    };

    window.addEventListener("mersia-theme-change", handleThemeChange);
    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener("mersia-theme-change", handleThemeChange);
      window.removeEventListener("storage", handleStorage);
    };
  }, [theme]);

  const toggle = () => {
    const next = toggleStoredTheme();
    setTheme(next);
  };

  return {
    theme,
    isDark: theme === "dark",
    isLight: theme === "light",
    toggleTheme: toggle,
    setTheme: (newTheme: ThemeMode) => {
      setStoredTheme(newTheme);
      setTheme(newTheme);
    },
  };
}

