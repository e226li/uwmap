import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, res: NextResponse) {
  const url = req.nextUrl.searchParams.get('url');
  const apiKey = process.env.NEXT_PUBLIC_API_KEY;

  if (!apiKey) {
    throw new Error('API_KEY is not defined');
  }
  
  if (!url) {
    throw new Error('url is not defined');
  }

  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      'API-Key': apiKey,
    },
  });

  const data = await response.json();

  return NextResponse.json(data);
}