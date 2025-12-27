import CryptoTable from '@/components/CryptoTable';
import { Coin } from '@/types/ui';

async function getStaticData() {
  try {
    // Call CoinGecko directly from server component - more reliable than internal API routes
    const res = await fetch(
      'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=150&page=1&sparkline=false',
      { 
        next: { revalidate: 60 },
        // Add timeout and better error handling
        signal: AbortSignal.timeout(10000) // 10 second timeout
      }
    );

    if (!res.ok) {
      const errorText = await res.text().catch(() => 'Unknown error');
      console.error(`Failed to fetch data from CoinGecko: ${res.status} ${res.statusText}`, {
        status: res.status,
        statusText: res.statusText,
        error: errorText
      });
      return [];
    }

    let data;
    try {
      data = await res.json();
    } catch (jsonError) {
      console.error('Failed to parse JSON response from CoinGecko:', jsonError);
      return [];
    }

    // Validate data structure
    if (!Array.isArray(data)) {
      console.error('Invalid data format from CoinGecko: expected array, got', typeof data);
      return [];
    }

    // Map CoinGecko data to our Coin structure
    const mappedData = data.map((coin: any): Coin => ({
      symbol: coin.symbol.toUpperCase(),
      name: coin.name,
      priceChangePercent: coin.price_change_percentage_24h?.toFixed(2) || '0',
      lastPrice: coin.current_price?.toString() || '0',
      volume: coin.total_volume?.toString() || '0',
      coinGeckoId: coin.id,
      image: coin.image,
    }));

    // Remove duplicates by symbol
    const seenSymbols = new Set<string>();
    const uniqueData = mappedData.filter((coin: Coin) => {
      if (seenSymbols.has(coin.symbol)) {
        return false;
      }
      seenSymbols.add(coin.symbol);
      return true;
    });

    return uniqueData;
  } catch (error) {
    // Handle different error types gracefully
    if (error instanceof Error) {
      if (error.name === 'AbortError' || error.name === 'TimeoutError') {
        console.error('Request timeout while fetching crypto data from CoinGecko');
      } else if (error.name === 'TypeError' && error.message.includes('fetch')) {
        console.error('Network error: Unable to reach CoinGecko API', error.message);
      } else {
        console.error('Error fetching crypto data:', error.message, error);
      }
    } else {
      console.error('Unknown error fetching crypto data:', error);
    }
    return [];
  }
}

 
export default async function Crypto() {
  const data = await getStaticData();

  return (
    <div className="min-h-screen bg-background">
      <section className="flex flex-col items-center justify-center p-4 sm:p-8">
        <CryptoTable data={data} />
      </section>
    </div>
  );
}