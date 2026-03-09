import { NextResponse } from 'next/server';

const PRICES_API_URL = 'https://api.rore.supply/api/prices';
const MOTHERLODE_API_URL = 'https://api.rore.supply/api/motherlode';
const ROUNDS_API_URL = 'https://api.rore.supply/api/rounds/current';

export async function GET() {
  try {
    const [pricesRes, motherlodeRes, roundsRes] = await Promise.all([
      fetch(PRICES_API_URL, {
        cache: 'no-store',
        headers: {
          Accept: 'application/json',
        },
      }),
      fetch(MOTHERLODE_API_URL, {
        cache: 'no-store',
        headers: {
          Accept: 'application/json',
        },
      }),
      fetch(ROUNDS_API_URL, {
        cache: 'no-store',
        headers: {
          Accept: 'application/json',
        },
      }),
    ]);

    if (!pricesRes.ok) throw new Error(`Prices fetch failed: ${pricesRes.status}`);
    if (!motherlodeRes.ok) throw new Error(`Motherlode fetch failed: ${motherlodeRes.status}`);
    if (!roundsRes.ok) throw new Error(`Rounds fetch failed: ${roundsRes.status}`);

    const pricesData = await pricesRes.json();
    const motherlodeData = await motherlodeRes.json();
    const roundsData = await roundsRes.json();

    // Aggregate key metrics
    const stats = {
      wethPrice: pricesData.weth,
      rorePrice: pricesData.ore * 0.95, // Estimated based on ORE price
      motherlode: {
        totalValue: motherlodeData.totalValue,
        totalORELocked: motherlodeData.totalORELocked,
        participants: motherlodeData.participants
      },
      currentRound: {
        number: roundsData.round,
        status: roundsData.status,
        prize: roundsData.prize,
        entries: roundsData.entries,
        endTime: roundsData.endTime
      },
      lastUpdated: Date.now()
    };

    // Add CORS headers
    const response = NextResponse.json(stats);
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
    
    return response;
  } catch (error) {
    console.error('Error in /api/stats:', error);
    return NextResponse.json(
      { error: 'Failed to aggregate stats from rORE API' }, 
      { status: 500 }
    );
  }
}

// Handle preflight requests
export function OPTIONS() {
  const response = NextResponse.json({});
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
  return response;
}
