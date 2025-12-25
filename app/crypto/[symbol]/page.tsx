import Image from "next/image";
import Link from "next/link";
import ChartWithIntervals from "@/components/ChartWithIntervals";
import CoinErrorPage from "@/components/CoinErrorPage";
import { getCoinGeckoIdFromSymbol, getCoinGeckoId } from "@/utils/coingecko";

type CoinDetail = {
  name: string;
  askPrice: string; 
  askQty: string;
  bidPrice: string;
  bidQty: string;
  closeTime: number;
  count: number;
  firstId: number;
  highPrice: string;
  lastId: number;
  lastPrice: string;
  lastQty: string;
  lowPrice: string;
  openPrice: string;
  openTime: number;
  prevClosePrice: string;
  priceChange: string;
  priceChangePercent: string;
  quoteVolume: string;
  symbol: string;
  volume: string;
  weightedAvgPrice: string;
  image?: string;
}

export async function getCoinDetail(baseSymbol: string) {
  try {
    // Get CoinGecko ID from symbol
    let coinGeckoId = getCoinGeckoIdFromSymbol(baseSymbol);
    if (!coinGeckoId) {
      coinGeckoId = await getCoinGeckoId(baseSymbol);
    }
    
    if (!coinGeckoId) {
      throw new Error('COIN_NOT_FOUND');
    }

    const res = await fetch(
      `https://api.coingecko.com/api/v3/coins/${coinGeckoId}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`,
      { next: { revalidate: 60 } }
    )

    if (!res.ok) {
      if (res.status === 404) {
        throw new Error('COIN_NOT_FOUND');
      }
      throw new Error('FETCH_ERROR');
    }

    const coinGeckoData = await res.json();
    const marketData = coinGeckoData.market_data;
    
    // Map CoinGecko data to our CoinDetail structure
    const coinDetail: CoinDetail = {
      name: coinGeckoData.name || baseSymbol,
      askPrice: marketData.current_price?.usd?.toString() || '0',
      askQty: '0',
      bidPrice: marketData.current_price?.usd?.toString() || '0',
      bidQty: '0',
      closeTime: Date.now(),
      count: 0,
      firstId: 0,
      highPrice: marketData.high_24h?.usd?.toString() || '0',
      lastId: 0,
      lastPrice: marketData.current_price?.usd?.toString() || '0',
      lastQty: '0',
      lowPrice: marketData.low_24h?.usd?.toString() || '0',
      openPrice: marketData.current_price?.usd?.toString() || '0',
      openTime: Date.now() - 86400000,
      prevClosePrice: (marketData.current_price?.usd - (marketData.price_change_24h || 0))?.toString() || '0',
      priceChange: marketData.price_change_24h?.toString() || '0',
      priceChangePercent: marketData.price_change_percentage_24h?.toFixed(2) || '0',
      quoteVolume: marketData.total_volume?.usd?.toString() || '0',
      symbol: baseSymbol,
      volume: marketData.total_volume?.usd?.toString() || '0',
      weightedAvgPrice: marketData.current_price?.usd?.toString() || '0',
      image: coinGeckoData.image?.large || coinGeckoData.image?.small || '',
    };

    return coinDetail;
  } catch (error) {
    if (error instanceof Error && error.message === 'COIN_NOT_FOUND') {
      throw error;
    }
    throw new Error('NETWORK_ERROR');
  }
}

type KlineData = [
  number,    // Open time
  string,    // Open
  string,    // High
  string,    // Low
  string,    // Close
  string,    // Volume
  number,    // Close time
  string,    // Quote asset volume
  number,    // Number of trades
  string,    // Taker buy base asset volume
  string,    // Taker buy quote asset volume
  string     // Ignore
];

export async function getKlines(
  baseSymbol: string,
  days: number = 1
): Promise<KlineData[]> {
  try {
    // Get CoinGecko ID from symbol
    let coinGeckoId = getCoinGeckoIdFromSymbol(baseSymbol);
    if (!coinGeckoId) {
      coinGeckoId = await getCoinGeckoId(baseSymbol);
    }
    
    if (!coinGeckoId) {
      throw new Error('COIN_NOT_FOUND');
    }

    const res = await fetch(
      `https://api.coingecko.com/api/v3/coins/${coinGeckoId}/market_chart?vs_currency=usd&days=${days}`,
      { next: { revalidate: 60 } }
    )

    if (!res.ok) {
      if (res.status === 404) {
        throw new Error('COIN_NOT_FOUND');
      }
      throw new Error('FETCH_ERROR');
    }

    const data = await res.json();
    const prices = data.prices || [];
    
    // Convert CoinGecko format to our KlineData format
    // CoinGecko: [[timestamp, price], ...]
    // Our format: [openTime, open, high, low, close, volume, closeTime, ...]
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

    return klines;
  } catch (error) {
    if (error instanceof Error && error.message === 'COIN_NOT_FOUND') {
      throw error;
    }
    throw new Error('NETWORK_ERROR');
  }
}

export default async function CryptoSymbol({ params }: { params: { symbol: string } }) {
  const { symbol } = await params;
  const baseSymbol = symbol.toUpperCase().replace('USDT', '');
  
  let coin: CoinDetail;
  let klines: KlineData[];
  let coinGeckoId: string | null = null;
  let error: Error | null = null;

  try {
    // Get CoinGecko ID first
    coinGeckoId = getCoinGeckoIdFromSymbol(baseSymbol);
    if (!coinGeckoId) {
      coinGeckoId = await getCoinGeckoId(baseSymbol);
    }
    
    coin = await getCoinDetail(baseSymbol);
    klines = await getKlines(baseSymbol, 1);
  } catch (err) {
    error = err instanceof Error ? err : new Error('Unknown error');
    // Return error UI
    return <CoinErrorPage baseSymbol={baseSymbol} error={error} />;
  }
  const formatPrice = (price: string) => {
    const num = parseFloat(price);
    return num.toLocaleString('en-US', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 8 
    });
  };

  const formatVolume = (volume: string) => {
    const num = parseFloat(volume);
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
    if (num >= 1e3) return `$${(num / 1e3).toFixed(2)}K`;
    return `$${num.toFixed(2)}`;
  };

  const priceChange = parseFloat(coin.priceChangePercent);
  const isPositive = priceChange >= 0;
  const coinName = coin.name;

  return (
    <div className="min-h-screen bg-background">
      <section className="flex flex-col p-4 sm:p-8 max-w-6xl mx-auto">
        {/* Back button */}
        <Link 
          href="/crypto"
          className="text-accent hover:text-accent/80 transition-colors mb-4 sm:mb-6 inline-flex items-center gap-2 text-sm sm:text-base"
        >
          ← Back to Crypto List
        </Link>

        {/* Coin Header */}
        <div className="bg-foreground rounded-lg p-4 sm:p-6 mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3 sm:gap-4">
              <Image 
                alt={`${coinName} logo`}
                width={48}
                height={48} loading="lazy"
                src={coin.image || `https://coin-images.coingecko.com/coins/images/1/small/bitcoin.png`}
                className="flex-shrink-0"
              />
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-primary">{coinName}</h1>
                <p className="text-secondary text-sm sm:text-base">{baseSymbol}/USDT</p>
              </div>
            </div>
            <div className="flex flex-col sm:items-end gap-1">
              <p className="text-2xl sm:text-3xl font-bold text-primary">
                ${formatPrice(coin.lastPrice)}
              </p>
              <p className={`text-lg sm:text-xl font-semibold ${isPositive ? 'text-success' : 'text-danger'}`}>
                {isPositive ? '+' : ''}{priceChange.toFixed(2)}%
              </p>
            </div>
          </div>
        </div>

        {/* Chart/Graphic Section */}
        <div className="bg-foreground rounded-lg p-4 sm:p-6 mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-primary mb-4">Price Chart</h2>
          <ChartWithIntervals 
            baseSymbol={baseSymbol} 
            coinGeckoId={coinGeckoId || ''}
            isPositive={isPositive} 
            initialKlines={klines}
          />
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Price Statistics */}
          <div className="bg-foreground rounded-lg p-4 sm:p-5">
            <h3 className="text-primary font-semibold text-sm sm:text-base mb-3">Price Statistics</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-secondary text-sm">24h High</span>
                <span className="text-primary font-medium text-sm">${formatPrice(coin.highPrice)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-secondary text-sm">24h Low</span>
                <span className="text-primary font-medium text-sm">${formatPrice(coin.lowPrice)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-secondary text-sm">Open Price</span>
                <span className="text-primary font-medium text-sm">${formatPrice(coin.openPrice)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-secondary text-sm">Prev Close</span>
                <span className="text-primary font-medium text-sm">${formatPrice(coin.prevClosePrice)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-secondary text-sm">Weighted Avg</span>
                <span className="text-primary font-medium text-sm">${formatPrice(coin.weightedAvgPrice)}</span>
              </div>
            </div>
          </div>

          {/* Trading Statistics */}
          <div className="bg-foreground rounded-lg p-4 sm:p-5">
            <h3 className="text-primary font-semibold text-sm sm:text-base mb-3">Trading Statistics</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-secondary text-sm">24h Volume</span>
                <span className="text-primary font-medium text-sm">{formatVolume(coin.volume)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-secondary text-sm">Quote Volume</span>
                <span className="text-primary font-medium text-sm">{formatVolume(coin.quoteVolume)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-secondary text-sm">Price Change</span>
                <span className={`font-medium text-sm ${isPositive ? 'text-success' : 'text-danger'}`}>
                  {isPositive ? '+' : ''}${formatPrice(coin.priceChange)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-secondary text-sm">Trades</span>
                <span className="text-primary font-medium text-sm">{coin.count.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Order Book */}
          <div className="bg-foreground rounded-lg p-4 sm:p-5">
            <h3 className="text-primary font-semibold text-sm sm:text-base mb-3">Order Book</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-secondary text-sm">Bid Price</span>
                <span className="text-primary font-medium text-sm">${formatPrice(coin.bidPrice)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-secondary text-sm">Bid Quantity</span>
                <span className="text-primary font-medium text-sm">{formatPrice(coin.bidQty)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-secondary text-sm">Ask Price</span>
                <span className="text-primary font-medium text-sm">${formatPrice(coin.askPrice)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-secondary text-sm">Ask Quantity</span>
                <span className="text-primary font-medium text-sm">{formatPrice(coin.askQty)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-secondary text-sm">Last Trade</span>
                <span className="text-primary font-medium text-sm">{formatPrice(coin.lastQty)}</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}