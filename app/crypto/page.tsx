import CryptoTable from '@/components/CryptoTable';
import { Coin } from '@/types/ui';

async function getStaticData() {
  try {
    // Use relative URL for server-side fetch - Next.js handles this automatically in production
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || '';
    const res = await fetch(`${baseUrl}/api/crypto/markets`, {
      next: { revalidate: 60 }
    });
    
    if (!res.ok) {
      console.log('Failed to fetch data from API');
      return [];
    }
    
    const data: Coin[] = await res.json();
    return data;
  } catch (error) {
    console.error('Error fetching crypto data:', error);
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