export const THEME_STORAGE_KEY = "civic-voice-theme";

export function getInitialTheme(storage = window.localStorage, mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")) {
  const savedTheme = storage.getItem(THEME_STORAGE_KEY);
  if (savedTheme === "light" || savedTheme === "dark") return savedTheme;
  return mediaQuery.matches ? "dark" : "light";
}

export function applyTheme(theme, documentElement = document.documentElement) {
  documentElement.dataset.theme = theme;
}

export function saveTheme(theme, storage = window.localStorage) {
  storage.setItem(THEME_STORAGE_KEY, theme);
}
