"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

type Theme = "system" | "light" | "dark";

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("system");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("checkmarkr-theme") as Theme | null;

    if (saved === "light" || saved === "dark" || saved === "system") {
      setTheme(saved);
    }

    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    localStorage.setItem("checkmarkr-theme", theme);

    const root = document.documentElement;

    if (theme === "dark") {
      root.classList.add("dark");
    } else if (theme === "light") {
      root.classList.remove("dark");
    } else {
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)",
      ).matches;

      root.classList.toggle("dark", prefersDark);
    }
  }, [theme, mounted]);

  function toggleTheme() {
    setTheme((current) => {
      if (current === "dark") return "light";
      if (current === "light") return "dark";
      return "dark";
    });
  }

  if (!mounted) {
    return (
      <button
        type="button"
        aria-label="Toggle theme"
        className="h-10 w-10 rounded-xl border border-black/10 bg-white/30 backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.05]"
      />
    );
  }

  const isDark =
    theme === "dark" ||
    (theme === "system" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="flex h-10 w-10 items-center justify-center rounded-xl border border-black/10 bg-white/30 text-stone-700 backdrop-blur-xl transition hover:bg-white/50 dark:border-white/10 dark:bg-white/[0.05] dark:text-stone-200 dark:hover:bg-white/[0.09]"
    >
      {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
}
