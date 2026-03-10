import { NextResponse } from 'next/server';
import { getPricesProxyResponse } from './proxy';

export async function GET() {
  const { body, status } = await getPricesProxyResponse();
  return NextResponse.json(body, { status });
}
