import { NextResponse } from 'next/server';
import { getExploreProxyResponse } from './proxy';

export async function GET(request: Request) {
  const { body, status } = await getExploreProxyResponse(new URL(request.url).searchParams);
  return NextResponse.json(body, { status });
}
