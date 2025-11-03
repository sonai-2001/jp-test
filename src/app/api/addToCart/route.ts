import { NextRequest, NextResponse } from "next/server";
import AddToCart from "@/models/addToCart";

// GET: Fetch all cart items or a single cart item by ID
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    const userId = url.searchParams.get("userId");

    if (id) {
      const cartItem = await AddToCart.findById(id);
      if (!cartItem) {
        return NextResponse.json(
          { error: "Cart item not found." },
          { status: 404 }
        );
      }
      return NextResponse.json(cartItem, { status: 200 });
    } else if (userId) {
      const cartItems = await AddToCart.find({ userId }).sort({ createdAt: -1 });
      return NextResponse.json(cartItems, { status: 200 });
    } else {
      const cartItems = await AddToCart.find().sort({ createdAt: -1 });
      return NextResponse.json(cartItems, { status: 200 });
    }
  } catch (error: any) {
    console.error("Error in GET /api/addToCart:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching the cart items." },
      { status: 500 }
    );
  }
}

// POST: Create a new cart item
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const newCartItem = new AddToCart(data);
    const savedCartItem = await newCartItem.save();
    return NextResponse.json(
      { message: "Cart item created successfully.", cartItem: savedCartItem },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error in POST /api/addToCart:", error);
    return NextResponse.json(
      { error: "An error occurred while creating the cart item." },
      { status: 500 }
    );
  }
}

// PATCH: Update an existing cart item
export async function PATCH(req: NextRequest) {
  try {
    const data = await req.json();
    const { id, ...updateData } = data;

    if (!id) {
      return NextResponse.json(
        { error: "Cart item ID is required." },
        { status: 400 }
      );
    }

    const updatedCartItem = await AddToCart.findByIdAndUpdate(id, updateData, { new: true });
    if (!updatedCartItem) {
      return NextResponse.json(
        { error: "Cart item not found." },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { message: "Cart item updated successfully.", cartItem: updatedCartItem },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error in PATCH /api/addToCart:", error);
    return NextResponse.json(
      { error: "An error occurred while updating the cart item." },
      { status: 500 }
    );
  }
}

// DELETE: Delete an existing cart item
export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    const deletedCartItem = await AddToCart.findByIdAndDelete(id);
    if (!deletedCartItem) {
      return NextResponse.json(
        { error: "Cart item not found." },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { message: "Cart item deleted successfully." },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error in DELETE /api/addToCart:", error);
    return NextResponse.json(
      { error: "An error occurred while deleting the cart item." },
      { status: 500 }
    );
  }
}
