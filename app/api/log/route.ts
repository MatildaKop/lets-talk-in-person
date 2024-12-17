import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const body = await request.json();
  console.log('Client-side log:', body);
  return NextResponse.json({ message: 'Logged successfully' });
}
