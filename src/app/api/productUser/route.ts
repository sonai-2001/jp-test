// src\app\api\productUser\route.ts
// API route for ProductUser registration
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import ProductUser from "@/models/ProductUser";
import { uploadToS3 } from "@/lib/uploadS3";
import sendToMail from "@/lib/sendToMail";


// POST: Handle user login and registration (NO CHANGE IN THIS SECTION)
export async function POST(req: NextRequest) {
  const baseURL = process.env.NEXT_PUBLIC_BASE_URL

  try {
    const { email, password, action, type } = await req.json();


    if (action === 'login') {
      // Validate required fields
      if (!email || !password || !action) {
        return NextResponse.json(
          { error: "Email and password fields are required." },
          { status: 400 }
        );
      }

      // Find user by email
      const user = await ProductUser.findOne({ email, type }).select("+password");

      if (!user) {
        return NextResponse.json(
          { error: "Invalid email or password." },
          { status: 401 }
        );
      }

      if (!user.isVerified) {
        return NextResponse.json(
          { error: "Please verified your email." },
          { status: 401 }
        );
      }


      const isPasswordMatch = await bcrypt.compare(password, user.password);
      if (!isPasswordMatch) {
        return NextResponse.json(
          { error: "Invalid email or password." },
          { status: 401 }
        );
      }

      // Generate JWT token
      const token = jwt.sign(
        { _id: user._id },
        process.env.JWT_TOKEN_SECRET!,
        // { expiresIn: "1d" }
      );

      // Remove password from response
      const { password: _, ...userWithoutPassword } = user.toObject();

      return NextResponse.json(
        {
          message: "Sign-In successfully.",
          token,
          data: userWithoutPassword,
        },
        { status: 200 }
      );
    }

    if (action === 'register') {
      // Validate required fields
      if (!email || !password || !action) {
        return NextResponse.json(
          { error: "Email and password fields are required." },
          { status: 400 }
        );
      }

      // Check if user already exists
      const user = await ProductUser.findOne({ email });
      if (user) {
        return NextResponse.json(
          { error: "User already exists." },
          { status: 400 }
        );
      }

      // Create new user
      const newUser = new ProductUser({
        email,
        password,
        type,
      });

      const response = await newUser.save();

      // Generate JWT token for verification
      const tokenForVerified = jwt.sign(
        { email: response.email },
        process.env.JWT_TOKEN_SECRET!,
        // { expiresIn: "1d" } // Consider adding an expiration for the verification token
      );

      // Remove password from response (for the API response body, not the saved user)
      const { password: _, ...userWithoutPassword } = response.toObject();

      const subject = "User Verification Communication"
      const emailTemplate = `
      <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4; width: 100%;">
        <div style="max-width: 500px; margin: auto; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
          <h2 style="color: #333; font-size: 28px;">Welcome to Jaypee Associates!</h2>
          <p>Hello,</p>
          <p>Your account has been successfully created.</p>
          <p>You can track your Enquiries here.</p>
          <p><strong>Email:</strong> ${email}</p>
          <p>Thank you for registering. Please verify your email by clicking the button below:</p>
          <p style="text-align: center; margin: 20px 0px;">
            <a href="${baseURL}/api/productUser/userVarification?token=${tokenForVerified}"
              style="background-color: #e50e0e; color: #fff; padding: 15px 32px; text-align: center; text-decoration: none;
              display: inline-block; font-size: 16px; margin: 4px 2px; cursor: pointer; border-radius: 10px;">
              Verify Email
            </a>
          </p>
          <p>If you have any questions, feel free to contact Support.</p>
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

      await sendToMail(email, emailTemplate, subject);

      return NextResponse.json(
        { message: "User registered successfully. Please verify your email to complete the registration. We've sent a confirmation link to your registered email.", data: userWithoutPassword },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { error: "Invalid action." },
      { status: 400 }
    );

  } catch (error: any) {
    console.error("Error in POST /api/productUser:", error);
    // It's better to return a 500 status code for internal server errors
    return NextResponse.json(
      { error: "An error occurred while processing the request." },
      { status: 500 }
    );
  }
}



// PATCH: Update an existing user
export async function PATCH(req: NextRequest) {
  try {

    const formData = await req.formData();
    const mockReq: any = { file: null, body: {} };

    // Process form data
    for (const [key, value] of formData.entries()) {
      if (key === "image" && value instanceof Blob) {
        mockReq.file = value;
      } else {
        mockReq.body[key] = value;
      }
    }

    const { id, name, email, password, companyName, mobile, address, gstNumber, sameAsAddress, deliveryAddress } =
      mockReq?.body;

    // Validate required fields
    if (!id) {
      return NextResponse.json(
        { error: "User ID is required." },
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

    const file = mockReq.file;
    const fileUrl = file ? await uploadToS3(file, "userProfile") : false;

    // Update user details
    if (name) user.name = name;
    if (email) user.email = email;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }
    // if (image) user.image = image;
    if (fileUrl) user.image = fileUrl;
    if (companyName) user.companyName = companyName;
    if (mobile) user.mobile = mobile;
    if (address) user.address = address;
    if (gstNumber) user.gstNumber = gstNumber;
    if (sameAsAddress) {
      user.sameAsAddress = sameAsAddress;
    } else {
      user.sameAsAddress = false;
    };
    if (deliveryAddress) user.deliveryAddress = deliveryAddress;

    await user.save();

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user.toObject();

    return NextResponse.json(
      { message: "User updated successfully.", data: userWithoutPassword },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error in PATCH /api/productUser:", error);
    return NextResponse.json(
      { error: "An error occurred while processing the request." },
      { status: 500 }
    );
  }
}

// GET: Fetch a single user by ID or all users if no ID is passed
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");

    if (id) {
      const user = await ProductUser.findById(id);
      if (!user) {
        return NextResponse.json(
          { error: "User not found." },
          { status: 404 }
        );
      }

      // Remove password from response
      const { password: _, ...userWithoutPassword } = user.toObject();

      return NextResponse.json(userWithoutPassword, { status: 200 });
    } else {
      const users = await ProductUser.find().sort({ createdAt: -1 });
      return NextResponse.json(users, { status: 200 });
    }
  } catch (error: any) {
    console.error("Error in GET /api/productUser:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching the user(s)." },
      { status: 500 }
    );
  }
}

// DELETE: Delete an existing user
export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json(
        { error: "User ID is required." },
        { status: 400 }
      );
    }

    const deletedUser = await ProductUser.findByIdAndDelete(id);
    if (!deletedUser) {
      return NextResponse.json(
        { error: "User not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "User deleted successfully." },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error in DELETE /api/productUser:", error);
    return NextResponse.json(
      { error: "An error occurred while deleting the user." },
      { status: 500 }
    );
  }
}