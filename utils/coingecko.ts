export async function getCoinGeckoId(symbol: string): Promise<string | null> {
  try {
    const coinListRes = await fetch(
      'https://api.coingecko.com/api/v3/coins/list',
      { 
        next: { revalidate: 3600 },
        signal: AbortSignal.timeout(10000) // 10 second timeout
      }
    );
    
    if (!coinListRes.ok) {
      const errorText = await coinListRes.text().catch(() => 'Unknown error');
      console.error(`Failed to fetch coin list from CoinGecko: ${coinListRes.status} ${coinListRes.statusText}`, {
        status: coinListRes.status,
        statusText: coinListRes.statusText,
        error: errorText
      });
      return null;
    }
    
    let coinList;
    try {
      coinList = await coinListRes.json();
    } catch (jsonError) {
      console.error('Failed to parse coin list JSON response:', jsonError);
      return null;
    }
    
    // Validate data structure
    if (!Array.isArray(coinList)) {
      console.error('Invalid coin list format: expected array, got', typeof coinList);
      return null;
    }
    
    const symbolLower = symbol.toLowerCase();
    const coin = coinList.find((c: any) => 
      c.symbol.toLowerCase() === symbolLower
    );
    
    return coin?.id || null;
  } catch (error) {
    // Handle different error types gracefully
    if (error instanceof Error) {
      if (error.name === 'AbortError' || error.name === 'TimeoutError') {
        console.error(`Request timeout while fetching CoinGecko ID for ${symbol}`);
      } else if (error.name === 'TypeError' && error.message.includes('fetch')) {
        console.error(`Network error fetching CoinGecko ID for ${symbol}:`, error.message);
      } else {
        console.error(`Error fetching CoinGecko ID for ${symbol}:`, error.message, error);
      }
    } else {
      console.error(`Unknown error fetching CoinGecko ID for ${symbol}:`, error);
    }
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

