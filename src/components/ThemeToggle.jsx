import { useEffect, useState } from "react";

const NEXT = { system: "dark", dark: "light", light: "system" };
const ICON = { system: "\u2726", dark: "\u263E", light: "\u2600" };
const LABEL = { system: "Theme: matches your device", dark: "Theme: dark", light: "Theme: light" };

export default function ThemeToggle() {
  const [theme, setTheme] = useState(() => {
    try { return localStorage.getItem("theme") || "system"; }
    catch { return "system"; }
  });

  useEffect(() => {
    if (theme === "system") {
      document.documentElement.removeAttribute("data-theme");
    } else {
      document.documentElement.setAttribute("data-theme", theme);
    }
    try { localStorage.setItem("theme", theme); } catch { /* fine */ }
  }, [theme]);

  return (
    <button className="theme-toggle" onClick={() => setTheme(NEXT[theme])}
      aria-label={LABEL[theme]} title={LABEL[theme]}>
      {ICON[theme]}
    </button>
  );
}