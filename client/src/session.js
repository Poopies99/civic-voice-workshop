export const SESSION_STORAGE_KEY = "civic-voice-session";

export function readSession(storage = window.localStorage) {
  try {
    const value = storage.getItem(SESSION_STORAGE_KEY);
    if (!value) return null;

    const session = JSON.parse(value);
    return session?.user ? session : null;
  } catch {
    return null;
  }
}

export function saveSession(session, storage = window.localStorage) {
  try {
    storage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
  } catch {
    // The app can still work for the current page when storage is unavailable.
  }
}

export function clearSession(storage = window.localStorage) {
  try {
    storage.removeItem(SESSION_STORAGE_KEY);
  } catch {
    // Nothing else is required when storage is unavailable.
  }
}
