import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import ProductUser from "@/models/ProductUser";
import sendToMail from "@/lib/sendToMail";

export async function POST(req: NextRequest) {
  try {
    const { id, token, email, newPassword, confirmPassword } = await req.json();

    const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

    if (id && token && newPassword && confirmPassword) {
      // Password reset process
      if (newPassword !== confirmPassword) {
        return NextResponse.json(
          { error: "Passwords do not match." },
          { status: 400 }
        );
      }

      // Verify token
      try {
        jwt.verify(token, process.env.JWT_TOKEN_SECRET!);
      } catch (error) {
        return NextResponse.json(
          { error: "Invalid or expired token." },
          { status: 400 }
        );
      }

      // Find user by ID
      const user = await ProductUser.findById(id);
      if (!user) {
        return NextResponse.json({ error: "User not found." }, { status: 404 });
      }

      // Update password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);
      await ProductUser.findByIdAndUpdate(id, { password: hashedPassword });

      return NextResponse.json(
        { message: "Password reset successfully." },
        { status: 200 }
      );
    } else if (email) {
      // Password recovery process
      // Find user by email
      const user = await ProductUser.findOne({ email });
      if (!user) {
        return NextResponse.json({ error: "User not found." }, { status: 404 });
      }

      // Generate password recovery token
      const recoveryToken = jwt.sign(
        { _id: user._id },
        process.env.JWT_TOKEN_SECRET!,
        { expiresIn: "1h" }
      );

      // Email template
      const subject = "Password Recovery Communication";
      const emailTemplate = `
       <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4;">
        <div style="max-width: 505px; margin: auto; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
          <h2 style="color: #333; font-size: 28px;">Password Reset Request has been received</h2>
          <p>Hello${
            user?.name && user?.name != undefined && user?.name != "undefined"
              ? ` ${user?.name}`
              : ""
          },</p>
          <p>You requested a password reset. Click the button below to reset your password:</p>
          <p style="text-align: center; margin: 20px 0;">
           <a href="${baseURL}/password-recovery?id=${
            user._id
            }&token=${recoveryToken}"  target="_blank"
             style="display: inline-block; padding: 15px 32px; background-color: #e50e0e; color: #fff; text-decoration: none; border-radius: 10px; font-size: 16px; cursor: pointer;">
            Reset Password
           </a>
          </p>
          <p>If you did not request a password change, please ignore this email.</p>
          <p>Thanks,</p>
          <p><b>Jaypee Associates Kolkata</b></p>
          <p>The CNC Workholding Specialists</p>
          <h5>TERMS & CONDITIONS, POLICIES -</h5>
            <p>
                Please take a moment to review our Terms & Conditions, FAQ’s Shipping & Delivery Policy, and Privacy Policy — these apply to all purchases. You can find them linked in the footer of our website or down below under "Useful Links" to help avoid any misunderstandings.
            </p>

  <h5>Useful Links-</h5>
          <a href="${baseURL}/faq/">FAQ<a>, 
          <a  href="${baseURL}/terms-condition/">Terms & Conditions</a>, <a  href="${baseURL}/shipping-policy/">Shipping & Delivery Policy</a>, <a  href="${baseURL}/privacy-policy/">Privacy Policy</a>
        <div style="max-width: 600px; margin: 20px auto; display: flex; align-items: center; gap: 18px;">
                <img src="https://jaypee-images.s3.ap-south-1.amazonaws.com/products/banner3.png" style=" height:120px;" />
            <p style="font-size: 14px; font-weight:600;">This is an AUTO-GENERATED Email. Kindly DO NOT reply or write to this Email address and use the 
                designated support contact informa on instead</p>
          </div>
          </div>
      </div>
      `;

      return await sendToMail(email, emailTemplate, subject);
    } else {
      return NextResponse.json({ error: "Invalid request." }, { status: 400 });
    }
  } catch (error: any) {
    console.error("Error in FORGOT_PASSWORD /api/productUser:", error);
    return NextResponse.json(
      { error: "An error occurred while processing the request." },
      { status: 500 }
    );
  }
}
