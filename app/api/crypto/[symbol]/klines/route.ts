import { NextResponse } from 'next/server';
import { getCoinGeckoIdFromSymbol, getCoinGeckoId } from '@/utils/coingecko';
import { KlineData } from '@/types/ui';

export async function GET(
  request: Request,
  { params }: { params: { symbol: string } }
) {
  try {
    const { symbol } = await params;
    const baseSymbol = symbol.toUpperCase().replace('USDT', '');
    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '1', 10);

    let coinGeckoId = getCoinGeckoIdFromSymbol(baseSymbol);
    if (!coinGeckoId) {
      coinGeckoId = await getCoinGeckoId(baseSymbol);
    }

    if (!coinGeckoId) {
      return NextResponse.json(
        { error: 'COIN_NOT_FOUND', message: 'Coin not found' },
        { status: 404 }
      );
    }

    const res = await fetch(
      `https://api.coingecko.com/api/v3/coins/${coinGeckoId}/market_chart?vs_currency=usd&days=${days}`,
      { next: { revalidate: 60 } }
    );

    if (!res.ok) {
      if (res.status === 404) {
        return NextResponse.json(
          { error: 'COIN_NOT_FOUND', message: 'Coin not found' },
          { status: 404 }
        );
      }
      return NextResponse.json(
        { error: 'FETCH_ERROR', message: 'Failed to fetch klines data' },
        { status: res.status }
      );
    }

    const data = await res.json();
    const prices = data.prices || [];

    // Convert CoinGecko format to KlineData format
    const klines: KlineData[] = prices.map((price: [number, number], index: number) => {
      const [timestamp, priceValue] = price;
      const nextPrice = prices[index + 1]?.[1] || priceValue;
      const high = Math.max(priceValue, nextPrice);
      const low = Math.min(priceValue, nextPrice);

      return [
        timestamp,                    // Open time
        priceValue.toString(),        // Open
        high.toString(),              // High
        low.toString(),               // Low
        priceValue.toString(),        // Close
        '0',                          // Volume (not available in market_chart)
        timestamp,                    // Close time
        '0',                          // Quote asset volume
        0,                            // Number of trades
        '0',                          // Taker buy base asset volume
        '0',                          // Taker buy quote asset volume
        '0'                           // Ignore
      ] as KlineData;
    });

    return NextResponse.json(klines);
  } catch (error) {
    console.error('Error fetching klines:', error);
    return NextResponse.json(
      { error: 'NETWORK_ERROR', message: 'Network error occurred' },
      { status: 500 }
    );
  }
}

