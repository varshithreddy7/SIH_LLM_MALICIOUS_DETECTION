import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [dark, setDark] = useState<boolean>(() =>
    typeof document !== "undefined" ? document.documentElement.classList.contains("dark") : true,
  );

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    try { localStorage.setItem("theme", dark ? "dark" : "light"); } catch {}
  }, [dark]);

  return (
    <button
      aria-label="Toggle theme"
      onClick={() => setDark((v) => !v)}
      className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 backdrop-blur text-white hover:bg-white/10 transition-colors"
    >
      {dark ? <Sun className="text-cyan-300" /> : <Moon className="text-purple-500" />}
      <span className="absolute -z-10 inset-0 rounded-full blur-xl opacity-30 bg-cyan-400/40" />
    </button>
  );
}
