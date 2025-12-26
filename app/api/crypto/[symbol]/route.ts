import { NextResponse } from 'next/server';
import { getCoinGeckoIdFromSymbol, getCoinGeckoId } from '@/utils/coingecko';

type CoinDetail = {
  name: string;
  symbol: string;
  lastPrice: string;
  priceChangePercent: string;
  priceChange: string;
  highPrice: string;
  lowPrice: string;
  openPrice: string;
  prevClosePrice: string;
  weightedAvgPrice: string;
  volume: string;
  quoteVolume: string;
  count: number;
  bidPrice: string;
  bidQty: string;
  askPrice: string;
  askQty: string;
  lastQty: string;
  image?: string;
  coinGeckoId?: string;
};

export async function GET(
  request: Request,
  { params }: { params: { symbol: string } }
) {
  try {
    const { symbol } = await params;
    const baseSymbol = symbol.toUpperCase().replace('USDT', '');

    // Get CoinGecko ID from symbol
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
      `https://api.coingecko.com/api/v3/coins/${coinGeckoId}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`,
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
        { error: 'FETCH_ERROR', message: 'Failed to fetch coin data' },
        { status: res.status }
      );
    }

    const coinGeckoData = await res.json();
    const marketData = coinGeckoData.market_data;

    // Map CoinGecko data to our CoinDetail structure
    const coinDetail: CoinDetail = {
      name: coinGeckoData.name || baseSymbol,
      symbol: baseSymbol,
      lastPrice: marketData.current_price?.usd?.toString() || '0',
      priceChangePercent: marketData.price_change_percentage_24h?.toFixed(2) || '0',
      priceChange: marketData.price_change_24h?.toString() || '0',
      highPrice: marketData.high_24h?.usd?.toString() || '0',
      lowPrice: marketData.low_24h?.usd?.toString() || '0',
      openPrice: marketData.current_price?.usd?.toString() || '0',
      prevClosePrice: (marketData.current_price?.usd - (marketData.price_change_24h || 0))?.toString() || '0',
      weightedAvgPrice: marketData.current_price?.usd?.toString() || '0',
      volume: marketData.total_volume?.usd?.toString() || '0',
      quoteVolume: marketData.total_volume?.usd?.toString() || '0',
      count: 0,
      bidPrice: marketData.current_price?.usd?.toString() || '0',
      bidQty: '0',
      askPrice: marketData.current_price?.usd?.toString() || '0',
      askQty: '0',
      lastQty: '0',
      image: coinGeckoData.image?.large || coinGeckoData.image?.small || '',
      coinGeckoId: coinGeckoId,
    };

    return NextResponse.json(coinDetail);
  } catch (error) {
    console.error('Error fetching coin detail:', error);
    return NextResponse.json(
      { error: 'NETWORK_ERROR', message: 'Network error occurred' },
      { status: 500 }
    );
  }
}

