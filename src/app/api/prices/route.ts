import { NextResponse } from 'next/server';

const PRICES_API_URL = 'https://api.rore.supply/api/prices';
const ERROR_RESPONSE = { error: 'Failed to fetch prices' };

export async function GET() {
  try {
    const res = await fetch(PRICES_API_URL, {
      cache: 'no-store',
      headers: {
        Accept: 'application/json',
      },
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching prices:', error);
    return NextResponse.json(ERROR_RESPONSE, { status: 500 });
  }
}
