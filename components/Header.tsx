'use client';

import Logo from "@/assets/icons/Logo";
import Moon from "@/assets/icons/Moon";
import Sun from "@/assets/icons/Sun";
import { ThemeIcon } from "@/assets/icons/Theme";
import { useTheme } from "@/contexts/ThemeContext";

export default function Header() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="flex items-center justify-between sticky top-0 z-50 bg-background p-4">

      <div className="flex items-center gap-2">
        <Logo width={24} height={24} className="text-accent" />
        <h1 className="text-accent text-2xl font-bold">Crypto Friend</h1>
      </div>

      <button
        onClick={toggleTheme}
        className="p-2 rounded-lg hover:bg-muted transition-colors"
        aria-label="Toggle theme"
      >
        <ThemeIcon theme={theme} />
      </button>
    </header>
  )
}