import { NextRequest, NextResponse } from "next/server";
import ConnectUs from "@/models/connectUs";
import { buildConnectUsAdminHtml, buildConnectUsAdminText } from "@/util/emailTemplates";
import { sendToAdminMail } from "@/lib/sendToMail";

export const runtime = "nodejs"; // Ensure Node runtime (Brevo SDK uses Node APIs)

export async function POST(req: NextRequest) {
  try {
    const { name, email, phone, message } = await req.json();

    // Validate required fields
    if (!name || !email || !phone || !message) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 });
    }

    // 1) Save to DB
    const newConnectUs = new ConnectUs({ name, email, phone, message });
    const savedConnectUs = await newConnectUs.save();

    // 2) Build email content
    const html = buildConnectUsAdminHtml({ name, email, phone, message });
    const text = buildConnectUsAdminText({ name, email, phone, message });
    const subject = `New Connect Us submission from ${name}`;

    // 3) Send email to test recipients
    const emailResult = await sendToAdminMail({
      subject,
      html,
      text,
      replyTo: email, // so admin can reply to the user directly
    });

    // 4) Respond with both DB and email status
    return NextResponse.json(
      {
        message: "Your message has been received.",
        data: savedConnectUs,
        emailSent: emailResult.ok,
        emailError: emailResult.ok ? undefined : emailResult.error,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error in POST /api/ConnectUs:", error);
    return NextResponse.json(
      { error: "An error occurred while submitting your message." },
      { status: 500 }
    );
  }
}

// GET: Fetch all ConnectUs entries or a single entry by ID
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");

    if (id) {
      const entry = await ConnectUs.findById(id);
      if (!entry) {
        return NextResponse.json(
          { error: "Message not found." },
          { status: 404 }
        );
      }
      return NextResponse.json(entry, { status: 200 });
    } else {
      const connectUsEntries = await ConnectUs.find().sort({ createdAt: -1 });
      return NextResponse.json(connectUsEntries, { status: 200 });
    }
  } catch (error: any) {
    console.error("Error in GET /api/ConnectUs:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching messages." },
      { status: 500 }
    );
  }
}

// DELETE: Delete a ConnectUs entry by ID
export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    if (!id) {
      return NextResponse.json(
        { error: "ID is required." },
        { status: 400 }
      );
    }
    const deleted = await ConnectUs.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json(
        { error: "Message not found." },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { message: "Message deleted successfully." },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error in DELETE /api/ConnectUs:", error);
    return NextResponse.json(
      { error: "An error occurred while deleting the message." },
      { status: 500 }
    );
  }
}
