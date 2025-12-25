import CryptoTable from '@/components/CryptoTable';

type CoinGeckoMarket = {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  high_24h: number;
  low_24h: number;
  total_volume: number;
  market_cap: number;
  last_updated: string;
};

type Repo = {
  symbol: string;
  name: string;
  priceChange: string;
  priceChangePercent: string;
  weightedAvgPrice: string;
  prevClosePrice: string; 
  lastPrice: string;
  lastQty: string;
  bidPrice: string;
  bidQty: string;
  askPrice: string;
  askQty: string;
  openPrice: string;
  highPrice: string;
  lowPrice: string;
  volume: string;
  quoteVolume: string;
  openTime: number;
  closeTime: number;
  firstId: number;    
  lastId: number;
  count: number;
  coinGeckoId?: string;
  image?: string;
}

async function getStaticData() {
  try {
    const res = await fetch(
      'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=150&page=1&sparkline=false',
      { next: { revalidate: 60 } }
    );
    
    if (!res.ok) {
      console.log('Failed to fetch data from CoinGecko');
      return [];
    }
    
    const data: CoinGeckoMarket[] = await res.json();
    
    // Map CoinGecko data to our Repo structure
    return data.map((coin): Repo => ({
      symbol: coin.symbol.toUpperCase(),
      name: coin.name,
      priceChange: coin.price_change_24h?.toString() || '0',
      priceChangePercent: coin.price_change_percentage_24h?.toFixed(2) || '0',
      weightedAvgPrice: coin.current_price?.toString() || '0',
      prevClosePrice: (coin.current_price - (coin.price_change_24h || 0))?.toString() || '0',
      lastPrice: coin.current_price?.toString() || '0',
      lastQty: '0',
      bidPrice: coin.current_price?.toString() || '0',
      bidQty: '0',
      askPrice: coin.current_price?.toString() || '0',
      askQty: '0',
      openPrice: (coin.current_price - (coin.price_change_24h || 0))?.toString() || '0',
      highPrice: coin.high_24h?.toString() || '0',
      lowPrice: coin.low_24h?.toString() || '0',
      volume: coin.total_volume?.toString() || '0',
      quoteVolume: coin.total_volume?.toString() || '0',
      openTime: Date.now() - 86400000, // 24h ago
      closeTime: Date.now(),
      firstId: 0,
      lastId: 0,
      count: 0,
      coinGeckoId: coin.id,
      image: coin.image,
    })) as Repo[];
  } catch (error) {
    console.error('Error fetching CoinGecko data:', error);
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