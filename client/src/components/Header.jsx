export function Header({ user, onLogout, theme, onToggleTheme }) {
  return (
    <header className="site-header">
      <a className="brand" href="/">
        <span className="brand-mark">C</span>
        <span>CivicVoice</span>
      </a>
      <div className="header-actions">
        {user && <span className="signed-in">Signed in as {user.name}</span>}
        <button
          aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          className="theme-toggle"
          onClick={onToggleTheme}
          type="button"
        >
          <span aria-hidden="true">{theme === "dark" ? "☀" : "☾"}</span>
          <span>{theme === "dark" ? "Light" : "Dark"}</span>
        </button>
        {user && <button className="text-button" onClick={onLogout}>Sign out</button>}
      </div>
    </header>
  );
}
