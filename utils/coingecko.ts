export async function getCoinGeckoId(symbol: string): Promise<string | null> {
  try {
    const coinListRes = await fetch(
      'https://api.coingecko.com/api/v3/coins/list',
      { next: { revalidate: 3600 } }
    );
    
    if (!coinListRes.ok) return null;
    
    const coinList = await coinListRes.json();
    const symbolLower = symbol.toLowerCase();
    
    const coin = coinList.find((c: any) => 
      c.symbol.toLowerCase() === symbolLower
    );
    
    return coin?.id || null;
  } catch (error) {
    console.error('Error fetching CoinGecko ID:', error);
    return null;
  }
}

const SYMBOL_TO_ID_MAP: Record<string, string> = {
  'BTC': 'bitcoin',
  'ETH': 'ethereum',
  'BNB': 'binancecoin',
  'SOL': 'solana',
  'XRP': 'ripple',
  'ADA': 'cardano',
  'DOGE': 'dogecoin',
  'DOT': 'polkadot',
  'MATIC': 'matic-network',
  'AVAX': 'avalanche-2',
  'LINK': 'chainlink',
  'LTC': 'litecoin',
  'BCH': 'bitcoin-cash',
  'XLM': 'stellar',
  'ATOM': 'cosmos',
  'ETC': 'ethereum-classic',
  'XMR': 'monero',
  'TRX': 'tron',
  'EOS': 'eos',
  'ALGO': 'algorand',
  'AAVE': 'aave',
  'UNI': 'uniswap',
  'COMP': 'compound-governance-token',
  'MKR': 'maker',
  'SUSHI': 'sushi',
  'YFI': 'yearn-finance',
  'SNX': 'havven',
  'CRV': 'curve-dao-token',
  '1INCH': '1inch',
  'ENJ': 'enjincoin',
  'MANA': 'decentraland',
  'SAND': 'the-sandbox',
  'AXS': 'axie-infinity',
  'GALA': 'gala',
  'CHZ': 'chiliz',
  'FLOW': 'flow',
  'NEAR': 'near',
  'FTM': 'fantom',
  'HBAR': 'hedera-hashgraph',
  'EGLD': 'elrond-erd-2',
  'THETA': 'theta-token',
  'ZIL': 'zilliqa',
  'BAT': 'basic-attention-token',
  'ZEC': 'zcash',
  'DASH': 'dash',
  'WAVES': 'waves',
  'ICP': 'internet-computer',
  'FIL': 'filecoin',
  'XTZ': 'tezos',
  'VET': 'vechain',
  'GRT': 'the-graph',
  'CAKE': 'pancakeswap-token',
  'SHIB': 'shiba-inu',
  'PEPE': 'pepe',
  'FLOKI': 'floki',
};

export function getCoinGeckoIdFromSymbol(symbol: string): string | null {
  const symbolUpper = symbol.toUpperCase();
  return SYMBOL_TO_ID_MAP[symbolUpper] || null;
}

