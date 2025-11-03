import { NextRequest, NextResponse } from "next/server";
import Product from "@/models/Product";
import Category from "@/models/Category";
import Brand from "@/models/Brand";

const generateSlug = (name: any) => {
  return name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .trim();
};

export async function GET(req: NextRequest, context: { params: any }) {
  try {
    const { slug } = await context.params; // ✅ This is correct

    if (!slug) {
      return NextResponse.json({ error: "Slug is required." }, { status: 400 });
    }

    const sanitizedSlug = generateSlug(`${slug}`); // Sanitize the slug

    const product = await Product.findOne({ slug: sanitizedSlug });

    if (!product) {
      return NextResponse.json({ error: "Product not found." }, { status: 404 });
    }

    const categoryDoc = await Category.findById(product.category);
    const brandDoc = await Brand.findById(product.brand);

    return NextResponse.json({
      ...product.toObject(),
      category: categoryDoc ? categoryDoc.category : null,
      category_id: categoryDoc ? categoryDoc._id : null,
      brand: brandDoc ? brandDoc.brandName : null,
      categorySlug: categoryDoc ? categoryDoc.slug : null,
    }, { status: 200 });

    // return NextResponse.json(product, { status: 200 });

  } catch (error) {
    console.error("Error in GET /api/product/[slug]:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching the product." },
      { status: 500 }
    );
  }
}
