import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import ProductUser from "@/models/ProductUser";

export async function POST(req: NextRequest) {
  try {
    const { id, oldPassword, newPassword, confirmPassword } = await req.json();

    // Validate required fields
    if (!id || !oldPassword || !newPassword || !confirmPassword) {
      return NextResponse.json(
        { error: "All fields are required." },
        { status: 400 }
      );
    }

    // Validate password match
    if (newPassword !== confirmPassword) {
      return NextResponse.json(
        { error: "New password and confirm password do not match." },
        { status: 400 }
      );
    }

    // Find user by ID
    const user = await ProductUser.findById(id).select("+password");
    if (!user) {
      return NextResponse.json(
        { error: "User not found." },
        { status: 404 }
      );
    }

    // Verify old password
    const isPasswordMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordMatch) {
      return NextResponse.json(
        { error: "Current password is incorrect." },
        { status: 401 }
      );
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Directly update password to prevent double hashing by Mongoose middleware
    await ProductUser.findByIdAndUpdate(id, { password: hashedPassword });

    // Fetch updated user for debugging
    await ProductUser.findById(id).select("+password");
   
    return NextResponse.json(
      { message: "Password changed successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in POST /api/changePassword:", error);
    return NextResponse.json(
      { error: "An error occurred while changing the password." },
      { status: 500 }
    );
  }
}

