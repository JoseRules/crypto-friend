import { NextResponse } from 'next/server';
import { Coin, CoinGeckoMarket } from '@/types/ui';



export async function GET() {
  try {
    const res = await fetch(
      'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=150&page=1&sparkline=false',
      { next: { revalidate: 60 } }
    );

    if (!res.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch data from CoinGecko' },
        { status: res.status }
      );
    }

    const data: CoinGeckoMarket[] = await res.json();

    // Map CoinGecko data to our Coin data type
    const mappedData = data.map((coin): Coin => ({
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
    const uniqueData = mappedData.filter((coin) => {
      if (seenSymbols.has(coin.symbol)) {
        return false;
      }
      seenSymbols.add(coin.symbol);
      return true;
    });

    return NextResponse.json(uniqueData);
  } catch (error) {
    console.error('Error fetching CoinGecko data:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

