import { NextRequest, NextResponse } from "next/server";
import Enquiry from "@/models/Enquiry";

// PATCH: Update an existing enquiry
export async function PATCH(req: NextRequest) {
  try {
    const { id, estimatedTime } = await req.json();

    // Corrected the condition to check for missing fields
    if (!id || !estimatedTime) {
      return NextResponse.json(
        { error: "All fields are required." },
        { status: 400 }
      );
    }

    const updatedEnquiry = await Enquiry.findOneAndUpdate(
      { _id: id },
      { estimatedTime },
      { new: true }
    );

    if (!updatedEnquiry) {
      return NextResponse.json(
        { error: "Enquiry not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Updated Estimated Time successfully.", data: updatedEnquiry },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error in PATCH /api/enquiry:", error);
    return NextResponse.json(
      { error: "An error occurred while updating the enquiry." },
      { status: 500 }
    );
  }
}
