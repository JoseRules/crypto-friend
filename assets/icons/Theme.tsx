'use client';

import { useEffect, useState } from 'react';
import Moon from './Moon';
import Sun from './Sun';


export function ThemeIcon({ theme }: { theme: string }) {

  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;
  return theme === 'dark' ? <Sun width={20} height={20} className="text-accent cursor-pointer" /> : <Moon width={20} height={20} className="text-accent cursor-pointer" />;
}