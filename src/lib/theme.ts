export type ThemeMode = "dark";

export function getStoredTheme(): ThemeMode {
  return "dark";
}

export function setStoredTheme(): void {
  applyThemeToDocument();
}

export function toggleStoredTheme(): ThemeMode {
  applyThemeToDocument();
  return "dark";
}

export function applyThemeToDocument(): void {
  if (typeof window === "undefined") return;
  document.documentElement.classList.add("dark");
}
