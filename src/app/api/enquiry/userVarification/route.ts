// src\app\api\productUser\route.ts
// API route for ProductUser registration
import { NextRequest, NextResponse } from "next/server";
import ProductUser from "@/models/ProductUser";
import jwt from "jsonwebtoken";

// GET: Handle user verification by token
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");

    // Validate required fields
    if (!token) {
      return NextResponse.json(
        { error: "Token is required." },
        { status: 400 }
      );
    }

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_TOKEN_SECRET!);
    } catch (error) {
      return NextResponse.json(
        { error: "Invalid or expired token." },
        { status: 401 }
      );
    }

    // Extract email from token
    const { email, id } = decoded as { email: string, id:string };

    // Check if user exists
    const user = await ProductUser.findOne({ email });
    if (!user) {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/notfound`, 302);
    }

    // Update user to set isVerified to true
    user.isVerified = true;
    await user.save();
    
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/my-enquiry/${id}`, 302);
  } catch (error: any) {
    console.error("Error in GET /api/productUser/userVarification:", error);
    return NextResponse.json(
      { error: "An error occurred while processing the request." },
      { status: 500 }
    );
  }
}
