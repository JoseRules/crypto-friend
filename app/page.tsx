'use client'
import { useTheme } from '@/contexts/ThemeContext';
import Presentation from "@/assets/icons/Presentation";
import Footer from "@/components/Footer";
import { useRouter } from 'next/navigation';
export default function Home() {
  const router = useRouter();
  
  return (
    <div className="flex min-h-screen flex-col bg-background font-sans">
      <main className="flex flex-1 items-center justify-center">
        <div className="flex w-full max-w-6xl flex-col items-center justify-between sm:py-24 py-12 px-4 sm:px-16 sm:items-start">
          <div className="flex items-center sm:justify-between justify-center w-full p-4 rounded-lg flex-col sm:flex-row gap-4 sm:gap-0">
            <div className="max-w-lg">
              <p className="text-accent text-3xl font-bold">Make better investment and trading decisions</p>
              <p className="text-secondary text-lg">The platform provides data, knowledge, and confidence to make better investment and trading decisions.</p>
              <button onClick={() => router.push('/crypto')} className="bg-accent text-button-text px-4 py-2 rounded-lg hover:bg-accent/80 transition-colors cursor-pointer mt-4">Get Started</button>
            </div>
            <div className="flex items-center justify-center w-80 h-120">
              <Presentation/>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
