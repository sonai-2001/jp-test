import { NextRequest, NextResponse } from "next/server";
import Product from "@/models/Product";
import Category from "@/models/Category";
import Brand from "@/models/Brand";

// GET: Fetch all products or a single product by ID
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (id && id !== "product") {
      const product = await Product.findById(id).sort({ createdAt: -1 });
      if (!product) {
        return NextResponse.json(
          { error: "Product not found." },
          { status: 404 }
        );
      }
      return NextResponse.json(product, { status: 200 });
    } else {
      const productsList = await Product.find().sort({ createdAt: -1 });
       let products: any[] = [];

    if (productsList && productsList.length > 0) {
      // For each product, fetch category and brand
      products = await Promise.all(
        productsList.map(async (item) => {
          // Fetch category and brand
          const categoryDoc = await Category.findById(item.category);
          const brandDoc = await Brand.findById(item.brand);

          return {
            ...item.toObject(),
            category: categoryDoc ? categoryDoc : null,
            brand: brandDoc ? brandDoc : null,
          };
        })
      );
    }
      return NextResponse.json(products, { status: 200 });
    }
  } catch (error: any) {
    console.error("Error in GET /api/product:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching the products." },
      { status: 500 }
    );
  }
}
