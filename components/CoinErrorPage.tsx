'use client';

import Alert from "@/assets/icons/Alert";
import ArrowLeft from "@/assets/icons/ArrowLeft";
import Link from "next/link";

interface CoinErrorPageProps {
  baseSymbol: string;
  error: Error;
}

export default function CoinErrorPage({ baseSymbol, error }: CoinErrorPageProps) {
  const isCoinNotFound = error.message === 'COIN_NOT_FOUND';
  const coinName = baseSymbol;

  return (
    <div className="min-h-screen bg-background">
      <section className="flex flex-col items-center justify-center p-4 sm:p-8 max-w-6xl mx-auto">
        {/* Back button */}
        <Link 
          href="/crypto"
          className="text-accent hover:text-accent/80 transition-colors mb-4 sm:mb-6 inline-flex items-center gap-2 text-sm sm:text-base self-start"
        >
         <ArrowLeft className="w-4 h-4" />
         Back to Crypto List
        </Link>

        {/* Error Card */}
        <div className="w-full bg-foreground rounded-lg p-6 sm:p-8 flex flex-col items-center justify-center text-center">
          <div className="mb-6">
            <Alert className="w-16 h-16 sm:w-20 sm:h-20 text-danger mx-auto" />
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-primary mb-3">
            {isCoinNotFound ? 'Coin Not Found' : 'Unable to Retrieve Data'}
          </h1>

          <p className="text-secondary text-base sm:text-lg mb-2 max-w-md">
            {isCoinNotFound ? (
              <>
                We couldn't find information for <span className="text-primary font-semibold">{coinName} ({baseSymbol})</span>.
                This coin may not be available or the symbol might be incorrect.
              </>
            ) : (
              <>
                We're having trouble retrieving data for <span className="text-primary font-semibold">{coinName} ({baseSymbol})</span> at the moment.
                Please try again later.
              </>
            )}
          </p>

          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <Link
              href="/crypto"
              className="bg-accent text-button-text px-6 py-2 rounded-lg hover:bg-accent/80 transition-colors font-medium"
            >
              Browse All Cryptocurrencies
            </Link>
            <button
              onClick={() => window.location.reload()}
              className="bg-foreground border border-foreground/20 text-primary px-6 py-2 rounded-lg hover:bg-foreground/80 transition-colors font-medium"
            >
              Try Again
            </button>
          </div>

          {!isCoinNotFound && (
            <div className="mt-8 pt-6 border-t border-foreground/20 w-full max-w-md">
              <p className="text-secondary text-sm">
                If this problem persists, it may be due to:
              </p>
              <ul className="text-secondary text-sm mt-2 text-left list-disc list-inside space-y-1">
                <li>Network connectivity issues</li>
                <li>Temporary API unavailability</li>
                <li>Service maintenance</li>
              </ul>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

