import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const protocolRes = await fetch('https://api.rore.supply/api/motherlode', {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const roundsRes = await fetch('https://api.rore.supply/api/rounds/current', {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!protocolRes.ok) {
      throw new Error(`Protocol fetch failed: ${protocolRes.status}`);
    }

    if (!roundsRes.ok) {
      throw new Error(`Rounds fetch failed: ${roundsRes.status}`);
    }

    const protocolData = await protocolRes.json();
    const roundsData = await roundsRes.json();

    // Add CORS headers
    const response = NextResponse.json({
      protocolStats: protocolData,
      currentRound: roundsData,
      lastUpdated: Date.now()
    });
    
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
    
    return response;
  } catch (error) {
    console.error('Error in /api/explore:', error);
    return NextResponse.json(
      { error: 'Failed to fetch data from rORE API' }, 
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