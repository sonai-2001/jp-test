import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import ProductUser from "@/models/ProductUser";
import sgMail from "@sendgrid/mail";

// POST: Forgot password - Send password recovery link
export async function FORGOTPASSWORD(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required." },
        { status: 400 }
      );
    }

    // Find user by email
    const user = await ProductUser.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { error: "User not found." },
        { status: 404 }
      );
    }

    // Generate password recovery token
    const token = jwt.sign(
      { _id: user._id },
      process.env.JWT_TOKEN_SECRET!,
      { expiresIn: "1h" }
    );

    // Email template
    const emailTemplate = `Password recovery link: /password-recovery?id=${user._id}&token=${token}`;

    const sendGridApiKey = process.env.SENDGRID_API_KEY;
    const sendGridFromEmail = process.env.SENDGRID_FROM_EMAIL;

    if (!sendGridApiKey || !sendGridFromEmail) {
      throw new Error("SendGrid API key or sender email is not configured.");
    }

    sgMail.setApiKey(sendGridApiKey);

    const mailOptions = {
      to: email,
      from: {
        email: sendGridFromEmail,
        name: 'Jaypee Associates',
      },
      subject: "Password Recovery",
      html: emailTemplate,
    };

    await sgMail.send(mailOptions);

    return NextResponse.json(
      { message: "Password recovery link sent to email." },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error in FORGOT_PASSWORD /api/productUser:", error);
    return NextResponse.json(
      { error: "An error occurred while processing the request." },
      { status: 500 }
    );
  }
}

// POST: Reset password
export async function RESETPASSWORD(req: NextRequest) {
  try {
    const { id, token, newPassword, confirmPassword } = await req.json();

    if (!id || !token || !newPassword || !confirmPassword) {
      return NextResponse.json(
        { error: "All fields are required." },
        { status: 400 }
      );
    }

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
      return NextResponse.json(
        { error: "User not found." },
        { status: 404 }
      );
    }

    // Update password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    return NextResponse.json(
      { message: "Password reset successfully." },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error in RESET_PASSWORD /api/productUser:", error);
    return NextResponse.json(
      { error: "An error occurred while processing the request." },
      { status: 500 }
    );
  }
}
