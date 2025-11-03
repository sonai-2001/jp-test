import { NextRequest, NextResponse } from "next/server";
import Product from "@/models/Product";
import Category from "@/models/Category";
import Brand from "@/models/Brand";
import Industry from "@/models/Industry";

export async function GET(req: NextRequest) {
  try {
    // Only select what we need
    const products = await Product.find()
      .select("brand category industries industry")
      .sort({ createdAt: -1 });

    if (!products || products.length === 0) {
      return NextResponse.json(
        { brands: [], categories: [], industries: [] },
        { status: 200 }
      );
    }

    const brandIds = new Set<string>();
    const categoryIds = new Set<string>();
    const industryIds = new Set<string>();

    for (const product of products) {
      if ((product as any).brand) brandIds.add((product as any).brand.toString());
      if ((product as any).category) categoryIds.add((product as any).category.toString());

      // Support both 'industries' (array) and legacy 'industry' (single)
      const indsArr = (product as any).industries;
      const indSingle = (product as any).industry;

      if (Array.isArray(indsArr) && indsArr.length) {
        indsArr.forEach((i: any) => i && industryIds.add(i.toString()));
      }
      if (indSingle) {
        industryIds.add(indSingle.toString());
      }
    }

    const [brandNameList, categoryNameList, industryNameList] = await Promise.all([
      Brand.find({ _id: { $in: Array.from(brandIds) } }).sort({ createdAt: -1 }),
      Category.find({ _id: { $in: Array.from(categoryIds) } }).sort({ createdAt: -1 }),
      Industry.find({ _id: { $in: Array.from(industryIds) } }).sort({ createdAt: -1 }),
    ]);

    return NextResponse.json(
      {
        brands: brandNameList,
        categories: categoryNameList,
        industries: industryNameList,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error in GET /api/product/getFilters:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching the products." },
      { status: 500 }
    );
  }
}