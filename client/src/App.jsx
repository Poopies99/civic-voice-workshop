import { useEffect, useState } from "react";
import { Header } from "./components/Header";
import { AdminPage } from "./pages/AdminPage";
import { CitizenPage } from "./pages/CitizenPage";
import { LoginPage } from "./pages/LoginPage";
import { applyTheme, getInitialTheme, saveTheme } from "./theme";

export default function App() {
  const [session, setSession] = useState(null);
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  function toggleTheme() {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    saveTheme(nextTheme);
  }

  return (
    <>
      <Header user={session?.user} onLogout={() => setSession(null)} theme={theme} onToggleTheme={toggleTheme} />
      {!session && <LoginPage onLogin={setSession} />}
      {session?.user.role === "citizen" && <CitizenPage user={session.user} />}
      {session?.user.role === "admin" && <AdminPage user={session.user} />}
    </>
  );
}
