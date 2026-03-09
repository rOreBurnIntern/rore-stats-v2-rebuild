'use client';

import Image from 'next/image';
import DashboardHeader from './components/DashboardHeader';
import MotherlodeCard from './components/MotherlodeCard';
import RoundCard from './components/RoundCard';
import StatCard from './components/StatCard';
import { fetchFromAPI } from './lib/fetcher';

interface StatsData {
  wethPrice: number;
  rorePrice: number;
  motherlode: {
    totalValue: number;
    totalORELocked: number;
    participants: number;
  };
  currentRound: {
    number: number;
    status: string;
    prize: number;
    entries: number;
    endTime: number;
  };
  lastUpdated: number;
}

export default async function Home() {
  const statsData: StatsData | null = await fetchFromAPI<StatsData>('/stats');

  const lastUpdate = statsData?.lastUpdated ? new Date(statsData.lastUpdated).toLocaleTimeString() : 'N/A';
  
  // Set document title
  if (typeof document !== 'undefined') {
    document.title = `rORE Stats: $${statsData?.rorePrice?.toFixed(6) || '—'} | Motherlode: ${statsData?.motherlode.totalValue?.toLocaleString() || '—'} WETH`;
  }

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 font-sans dark:bg-black">
      <main className="flex w-full max-w-7xl flex-col gap-8 px-4 py-8 mx-auto">
        <DashboardHeader />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            title="WETH Price" 
            value={statsData?.wethPrice ? statsData.wethPrice.toFixed(2) : '—'} 
            isCurrency={true} 
            loading={!statsData}
          />
          <StatCard 
            title="rORE Price" 
            value={statsData?.rorePrice ? statsData.rorePrice.toFixed(6) : '—'} 
            subtitle="Est. price" 
            isCurrency={true} 
            loading={!statsData}
          />
          <StatCard 
            title="24h Volume" 
            value="—" 
            subtitle="WETH" 
            isCurrency={true} 
            loading={true}
          />
          <StatCard 
            title="Transactions" 
            value="—" 
            subtitle="Today" 
            loading={true}
          />
        </div>

        {statsData?.motherlode && <MotherlodeCard {...statsData.motherlode} />}
        
        {statsData?.currentRound && <RoundCard {...statsData.currentRound} />}

        <div className="text-center mt-12 text-sm text-zinc-500 dark:text-zinc-600">
          Data sourced from rORE Protocol API • Updated {lastUpdate}
        </div>
      </main>
    </div>
  );
}