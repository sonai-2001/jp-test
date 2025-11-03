import { NextRequest, NextResponse } from "next/server";
import Product from "@/models/Product";

// PATCH: Update the bestseller status of a product
export async function PATCH(req: NextRequest) {
  try {
    const { id, bestseller } = await req.json();

    // Check if the product exists
    const existingProduct = await Product.findById(id);
    if (!existingProduct) {
      return NextResponse.json(
        { status: false, error: "Product not found." },
        { status: 404 }
      );
    }
    
    // Update the bestseller status
    existingProduct.bestseller = bestseller;
    const updatedProduct = await existingProduct.save();

    return NextResponse.json(
      { message: "Product updated successfully.", product: updatedProduct },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error in PATCH /api/product/updateStatus:", error);
    return NextResponse.json(
      { status: false, error: "An error occurred while updating the product." },
      { status: 500 }
    );
  }
}
