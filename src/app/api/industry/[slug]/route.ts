import { NextRequest, NextResponse } from "next/server";
import Industry from "@/models/Industry"; // adjust path if needed

// GET /api/industry/[slug]
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    console.log("🚀 ~ GET ~ slug:", slug);

    if (!slug) {
      return NextResponse.json(
        { error: "Slug is required." },
        { status: 400 }
      );
    }

    // Find industry by slug
    const industry = await Industry.findOne({ slug }).lean();
    console.log("🚀 ~ GET ~ industry:", industry);

    if (!industry) {
      return NextResponse.json(
        { error: "Industry not found." },
        { status: 404 }
      );
    }

    // Return only useful info
    return NextResponse.json(
      {
        industry: industry.industry,
        slug: industry.slug,
        industryImage: industry.industryImage || null,
        description: industry.description || "",
      },
      { status: 200 }
    );

  } catch (err) {
    console.error("Error in GET /api/industry/[slug]:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}