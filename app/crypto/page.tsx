import CryptoTable from '@/components/CryptoTable';

type Repo = {
  symbol: string;
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
}

async function getStaticData() {
  const res = await fetch('https://api.binance.com/api/v3/ticker/24hr', {
    cache: 'no-store',
    headers: {
      'User-Agent': 'Mozilla/5.0',
      'Accept': 'application/json'
    }
  })
  console.log(res);
  if (!res.ok) {
    console.log('Failed to fetch data');
    return [];
  }
  const data = await res.json();
  return data.filter((item: Repo) => item.symbol.endsWith('USDT')).sort((a: Repo, b: Repo) => Number(b.quoteVolume) - Number(a.quoteVolume)).slice(0, 150) as Repo[];
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