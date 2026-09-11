"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState, useTransition } from "react";

import { saveTheme } from "@/lib/actions/settings";
import type { ThemeMode } from "@/types/database";

type ThemeToggleProps = {
  initialTheme?: ThemeMode;
  authenticated?: boolean;
};

function getSystemTheme(): "light" | "dark" {
  if (typeof window === "undefined") {
    return "light";
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function applyTheme(theme: ThemeMode) {
  if (typeof document === "undefined") {
    return;
  }

  const resolvedTheme = theme === "system" ? getSystemTheme() : theme;

  document.documentElement.classList.toggle("dark", resolvedTheme === "dark");

  document.documentElement.style.colorScheme = resolvedTheme;
}

export function ThemeToggle({
  initialTheme = "system",
  authenticated = false,
}: ThemeToggleProps) {
  const [theme, setTheme] = useState<ThemeMode>(initialTheme);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    const storedTheme = window.localStorage.getItem(
      "checkmarkr-theme",
    ) as ThemeMode | null;

    if (
      storedTheme === "system" ||
      storedTheme === "light" ||
      storedTheme === "dark"
    ) {
      setTheme(storedTheme);
      applyTheme(storedTheme);
      return;
    }

    setTheme(initialTheme);
    applyTheme(initialTheme);
  }, [initialTheme]);

  useEffect(() => {
    if (theme !== "system") {
      applyTheme(theme);
      return;
    }

    applyTheme("system");

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = () => {
      applyTheme("system");
    };

    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, [theme]);

  function toggleTheme() {
    const currentTheme = theme === "system" ? getSystemTheme() : theme;

    const nextTheme = currentTheme === "dark" ? "light" : "dark";

    setTheme(nextTheme);
    window.localStorage.setItem("checkmarkr-theme", nextTheme);

    applyTheme(nextTheme);

    if (authenticated) {
      startTransition(async () => {
        try {
          await saveTheme(nextTheme);
        } catch (error) {
          console.error("Unable to save theme:", error);
        }
      });
    }
  }

  const resolvedTheme = theme === "system" ? getSystemTheme() : theme;

  const Icon = resolvedTheme === "dark" ? Moon : Sun;

  const label =
    theme === "system"
      ? `System theme (${resolvedTheme})`
      : resolvedTheme === "dark"
        ? "Dark theme"
        : "Light theme";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      disabled={pending}
      aria-label={`${label}. Click to switch theme.`}
      title={label}
      className="flex h-9 w-9 items-center justify-center rounded-xl border border-black/10 bg-white/30 text-stone-600 backdrop-blur-xl transition hover:bg-white/55 hover:text-stone-950 disabled:opacity-50 dark:border-white/10 dark:bg-white/[0.04] dark:text-stone-300 dark:hover:bg-white/[0.08] dark:hover:text-white"
    >
      <Icon size={17} strokeWidth={1.8} />
    </button>
  );
}
