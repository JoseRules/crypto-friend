export type SortColumn = 'Name' | 'Symbol' | 'Price' | 'Price Change' | 'Volume' | null;
export type SortDirection = 'asc' | 'desc';

export type KlineData = [
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

export type Coin = {
  symbol: string;
  name: string;
  priceChangePercent: string;
  lastPrice: string;
  volume: string;
  coinGeckoId?: string;
  image?: string;
};

export type CoinDetail = {
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
}

export type CoinGeckoMarket = {
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