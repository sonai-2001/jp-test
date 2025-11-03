import Team from "@/models/ourTeam";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "0", 10);

    let q = Team.find({}).sort({ createdAt: -1 });
    if (limit > 0) q = q.limit(limit);

    const list = await q;
    return NextResponse.json(list, { status: 200 });
  } catch (e) {
    console.error("GET /api/team/getAll error", e);
    return NextResponse.json(
      { error: "Failed to fetch team members." },
      { status: 500 }
    );
  }
}
