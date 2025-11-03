// @/app/api/contact/route.ts - JSON version
import Contact from "@/models/contact";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const contactData = await req.json();

    // ✅ Check if Contact exists
    const existing = await Contact.findOne();

    if (existing) {
      Object.assign(existing, contactData);
      const updated = await existing.save();
      return NextResponse.json(
        {
          status: true,
          message: "Contact information updated successfully",
          data: updated,
        },
        { status: 200 }
      );
    } else {
      const created = new Contact(contactData);
      const saved = await created.save();
      return NextResponse.json(
        {
          status: true,
          message: "Contact information created successfully",
          data: saved,
        },
        { status: 201 }
      );
    }
  } catch (error: any) {
    console.error("Error saving contact information:", error);
    return NextResponse.json(
      {
        status: false,
        message: "Failed to save contact information",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const contact = await Contact.findOne();
    return NextResponse.json(contact || {}, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      {
        status: false,
        message: "Failed to fetch contact information",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
