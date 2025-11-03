// /app/api/seo/route.ts
import { NextResponse } from 'next/server';
import Seo from '@/models/Seo';
import { connectToDatabase } from '@/lib/mongodb';

export async function GET() {
  await connectToDatabase();
  const seoList = await Seo.find();
  return NextResponse.json(seoList);
}