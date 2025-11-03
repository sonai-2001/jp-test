import { NextRequest, NextResponse } from "next/server";
import Category from "@/models/Category"; // adjust path if needed

// GET /api/category/[slug]
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> } // ✅ Fixed: params is now a Promise
) {
  try {
    const { slug } = await params; // ✅ Fixed: await the params Promise
    console.log("🚀 ~ GET ~ slug:", slug)

    if (!slug) {
      return NextResponse.json(
        { error: "Slug is required." },
        { status: 400 }
      );
    }

    // Find category by slug
    const category = await Category.findOne({ slug }).lean();
    console.log("🚀 ~ GET ~ category:", category)

    if (!category) {
      return NextResponse.json(
        { error: "Category not found." },
        { status: 404 }
      );
    }

    // Return only useful info
    return NextResponse.json(
      {
        category: category.category,
        slug: category.slug,
        categoryImage: category.categoryImage || null,
        description: category.description || "",
      },
      { status: 200 }
    );

  } catch (err) {
    console.error("Error in GET /api/category/[slug]:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}