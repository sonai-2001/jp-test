// src\app\api\auth\route.ts

import { NextRequest, NextResponse } from "next/server";
import ProductUser from "@/models/ProductUser";
import jwt from "jsonwebtoken";


// GET: Fetch a single user by ID or all users if no ID is passed
// POST: Handle user login and registration
export async function POST(req: NextRequest) {
    try {
        const url = new URL(req.url);
        const id = url.searchParams.get("id");
        const { email, action, type } = await req.json();

        // Validate required fields
        if (!id || !email || !action || !type) {
            return NextResponse.json(
                { error: "ID, email, action, and type fields are required." },
                { status: 400 }
            );
        }

        if (action !== "auth") {
            return NextResponse.json(
                { error: "Invalid action. Only 'auth' is allowed." },
                { status: 400 }
            );
        }

        // Find user by email
        const user = await ProductUser.findOne({ email, type, _id: id }).select("+password");

        if (!user) {
            return NextResponse.json(
                { error: "User does not exist." },
                { status: 404 }
            );
        }

        // Check if the user is verified
        if (!user.isVerified) {
            return NextResponse.json(
                { error: "User is not authorized." },
                { status: 401 }
            );
        }

        // Generate JWT token
        const token = jwt.sign(
            { _id: user._id },
            process.env.JWT_TOKEN_SECRET!
            // { expiresIn: "1d" }
        );

        // Remove password from response
        const { password: _, ...userWithoutPassword } = user.toObject();

        return NextResponse.json(
            {
                message: "Welcome message.",
                token,
                data: userWithoutPassword,
            },
            { status: 200 }
        );

    } catch (error: any) {
        console.error("Error in POST /api/productUser:", error);
        return NextResponse.json(
            { error: "An error occurred while processing the request." },
            { status: 500 }
        );
    }
}