// app/api/brand/[slug]/route.ts
import { NextResponse } from "next/server";
import Brand from "@/models/Brand";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    // Await the params since they're now a Promise
    const { slug } = await params;
    
    if (!slug) {
      return NextResponse.json(
        { status: false, message: "Slug is required" },
        { status: 400 }
      );
    }

    const brandDoc = await Brand.findOne({ slug })
      .populate("selectedCatalogue", "catalogueName catalogueFile")
      .lean();

    if (!brandDoc) {
      return NextResponse.json(
        { status: false, message: "Brand not found" },
        { status: 404 }
      );
    }

    const derivedCatalogueFile =
      brandDoc.catalogueFile ||
      (brandDoc as any)?.selectedCatalogue?.catalogueFile ||
      "";

    const brand = { ...brandDoc, catalogueFile: derivedCatalogueFile };

    return NextResponse.json({ status: true, brand }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { status: false, message: "Failed to fetch brand", error: error.message },
      { status: 500 }
    );
  }
}