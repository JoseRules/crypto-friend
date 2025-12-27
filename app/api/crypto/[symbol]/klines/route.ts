import { NextRequest, NextResponse } from 'next/server';
import { getCoinGeckoIdFromSymbol, getCoinGeckoId } from '@/utils/coingecko';
import { KlineData } from '@/types/ui';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ symbol: string }> }
) {
  const { symbol } = await params;
  const baseSymbol = symbol.toUpperCase().replace('USDT', '');
  const { searchParams } = new URL(request.url);
  const days = parseInt(searchParams.get('days') || '1', 10);
  
  try {
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
      { 
        next: { revalidate: 60 },
        signal: AbortSignal.timeout(15000) // 15 second timeout for chart data
      }
    );

    if (!res.ok) {
      const errorText = await res.text().catch(() => 'Unknown error');
      console.error(`Failed to fetch klines from CoinGecko: ${res.status} ${res.statusText}`, {
        coinGeckoId,
        symbol: baseSymbol,
        days,
        status: res.status,
        statusText: res.statusText,
        error: errorText
      });
      
      if (res.status === 404) {
        return NextResponse.json(
          { error: 'COIN_NOT_FOUND', message: 'Coin not found' },
          { status: 404 }
        );
      }
      return NextResponse.json(
        { error: 'FETCH_ERROR', message: `Failed to fetch klines data: ${res.status} ${res.statusText}` },
        { status: res.status }
      );
    }

    let data;
    try {
      data = await res.json();
    } catch (jsonError) {
      console.error(`Failed to parse JSON response for klines (${coinGeckoId}):`, jsonError);
      return NextResponse.json(
        { error: 'PARSE_ERROR', message: 'Invalid response format from CoinGecko' },
        { status: 500 }
      );
    }
    const prices = data.prices || [];

    // Validate prices array
    if (!Array.isArray(prices) || prices.length === 0) {
      console.warn(`No price data available for ${baseSymbol} (${coinGeckoId})`);
      return NextResponse.json(
        { error: 'NO_DATA', message: 'No price data available for this coin' },
        { status: 404 }
      );
    }

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
    // Handle different error types gracefully
    if (error instanceof Error) {
      if (error.name === 'AbortError' || error.name === 'TimeoutError') {
        console.error(`Request timeout while fetching klines for ${baseSymbol}`);
        return NextResponse.json(
          { error: 'TIMEOUT_ERROR', message: 'Request timed out. Please try again.' },
          { status: 504 }
        );
      } else if (error.name === 'TypeError' && error.message.includes('fetch')) {
        console.error(`Network error fetching klines for ${baseSymbol}:`, error.message);
        return NextResponse.json(
          { error: 'NETWORK_ERROR', message: 'Unable to reach CoinGecko API. Please check your connection.' },
          { status: 503 }
        );
      } else {
        console.error(`Error fetching klines for ${baseSymbol}:`, error.message, error);
      }
    } else {
      console.error(`Unknown error fetching klines for ${baseSymbol}:`, error);
    }
    return NextResponse.json(
      { error: 'NETWORK_ERROR', message: 'An unexpected error occurred while fetching chart data' },
      { status: 500 }
    );
  }
}

