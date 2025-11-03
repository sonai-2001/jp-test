// app/api/redirect/[...slug]/route.ts
import { NextResponse } from 'next/server';
import Redirect from '@/models/Redirect';
import { connectToDatabase } from '@/lib/mongodb';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function normalize(p: string) {
  return String(p || '').replace(/^\/+|\/+$/g, '');
}

// Shape of a redirect row we read from Mongo
type RedirectLean = { from: string; to: string; type?: string };

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string[] }> }
) {
  await connectToDatabase();

  // Await the params since they're now a Promise in newer Next.js versions
  const resolvedParams = await params;
  
  const from = normalize((resolvedParams.slug ?? []).map(s => decodeURIComponent(s)).join('/')); // e.g. "categories/old-slug"
  if (!from) {
    return NextResponse.json({ found: false }, { status: 400 });
  }

  // Follow chains safely (A -> B -> C) with loop protection
  let current = from;
  let code = 301;
  const visited = new Set<string>();

  for (let i = 0; i < 10; i++) {
    if (visited.has(current)) break;
    visited.add(current);

    const doc = await Redirect.findOne({ from: current }).lean<RedirectLean | null>();
    if (!doc) break;

    code = parseInt(String(doc.type ?? '301'), 10) || 301;
    const nextPath = normalize(doc.to || '');
    if (!nextPath || nextPath === current) break;

    current = nextPath;
  }

  if (current !== from) {
    return NextResponse.json({ found: true, to: `/${current}`, code }, { status: 200 });
  }

  return NextResponse.json({ found: false }, { status: 404 });
}