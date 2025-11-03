
// src\app\api\productUser\route.ts
// API route for ProductUser registration and verification

import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import ProductUser from "@/models/ProductUser"; // Assuming your Mongoose model path

// Helper function to generate an HTML response that redirects client-side
// This is used for the GET handler (user verification)
const renderRedirectHTML = (message: string, redirectUrl: string, status: number = 200) => {
    return new NextResponse(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Verification Status</title>
        <meta http-equiv="refresh" content="0;url=${redirectUrl}">
        <style>
          body { font-family: Arial, sans-serif; text-align: center; padding-top: 50px; background-color: #f4f4f4; }
          .container { max-width: 600px; margin: auto; padding: 30px; border: 1px solid #ddd; border-radius: 8px; background-color: #fff; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
          h1 { color: #333; margin-bottom: 20px; }
          p { color: #666; line-height: 1.6; }
          a { color: #007bff; text-decoration: none; font-weight: bold; }
          a:hover { text-decoration: underline; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Processing Request...</h1>
          <p>${message}</p>
          <p>If you are not redirected automatically, please <a href="${redirectUrl}">click here</a>.</p>
        </div>
      </body>
      </html>
    `, {
        status: status, // Set HTTP status code (e.g., 200, 400, 401, 404)
        headers: {
          'Content-Type': 'text/html',
        },
    });
};


// GET: Handle user verification by token (MODIFIED SECTION)
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");
  const baseURL = process.env.NEXT_PUBLIC_BASE_URL;
  // Redirect URLs on your frontend
  const redirectSuccessUrl = `${baseURL}/user-verification?status=success`; // Added status query param for frontend
  const redirectFailureUrl = `${baseURL}/user-verification?status=error`;   // Added status query param for frontend
  // Optionally, redirect to home or a specific error page on severe failures
  // const redirectSevereErrorUrl = `${baseURL}/error-page`;

  try {
    // Validate required fields
    if (!token) {
      console.error("Verification attempt with missing token.");
      // Use the HTML redirect helper instead of JSON response
      return renderRedirectHTML("Verification token is missing.", redirectFailureUrl, 400);
    }

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_TOKEN_SECRET!);
      // Ensure decoded token has the 'email' property
      if (typeof decoded !== 'object' || decoded === null || !('email' in decoded)) {
           console.error("Decoded token payload is invalid:", decoded);
           return renderRedirectHTML("Invalid verification token payload.", redirectFailureUrl, 401);
      }
    } catch (error) {
      console.error("Invalid or expired token:", (error as Error).message);
      // Use the HTML redirect helper instead of JSON response
      return renderRedirectHTML("Invalid or expired verification token.", redirectFailureUrl, 401);
    }

    // Extract email from token
    const { email } = decoded as { email: string };

    // Check if user exists
    const user = await ProductUser.findOne({ email });
    if (!user) {
      console.error(`User with email ${email} not found during verification.`);
      // Use the HTML redirect helper instead of JSON response or server-side redirect
      return renderRedirectHTML("User not found for verification.", redirectFailureUrl, 404);
    }

    // Check if already verified
     if (user.isVerified) {
         // User is already verified, still show success message and redirect to success page
         // You might want a different success message here on the frontend
         return renderRedirectHTML("Your email is already verified. Redirecting...", redirectSuccessUrl, 200);
     }


    // Update user to set isVerified to true
    user.isVerified = true;
    await user.save();

    console.log(`User ${email} verified successfully.`);

    // Use the HTML redirect helper instead of server-side redirect
    return renderRedirectHTML("Email verified successfully. Redirecting...", redirectSuccessUrl, 200);

  } catch (error: any) {
    console.error("Internal error during user verification:", error);
    // Use the HTML redirect helper for internal errors as well
    return renderRedirectHTML("An internal error occurred during verification.", redirectFailureUrl, 500); // Using failure URL for general error
  }
}