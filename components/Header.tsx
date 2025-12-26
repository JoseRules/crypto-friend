'use client';

import Link from "next/link";
import Logo from "@/assets/icons/Logo";
import { ThemeIcon } from "@/assets/icons/Theme";
import { useTheme } from "@/contexts/ThemeContext";

export default function Header() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="flex items-center justify-between sticky top-0 z-50 bg-background p-4">

      <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer">
        <Logo width={24} height={24} className="text-accent" />
        <h1 className="text-accent text-2xl font-bold">Crypto Friend</h1>
      </Link>

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