import { NextRequest, NextResponse } from "next/server";
import Enquiry from "@/models/Enquiry";
import { uploadToS3 } from "@/lib/uploadS3";

// PATCH: Update an existing enquiry with payment slip
export async function PATCH(req: NextRequest) {
  try {
    const formData = await req.formData();
    const mockReq: any = { file: null, body: {} };

    // Process form data
    for (const [key, value] of formData.entries()) {
      if (key === "paymentSlip" && value instanceof Blob) {
        mockReq.file = value;
      } else {
        mockReq.body[key] = value;
      }
    }

    const file = mockReq.file;
    const fileUrl = file ? await uploadToS3(file, "paymentSlip") : false;

    const { id, ...data } = mockReq.body;

    const enquiryData: any = await Enquiry.findById(id)
    const tableData = enquiryData.analysisTable
    tableData.push({ date: new Date(), old: enquiryData?.status, new: data?.status })

    if (!id) {
      return NextResponse.json(
        { error: "Enquiry ID is required." },
        { status: 400 }
      );
    }

    const updatedEnquiry = await Enquiry.findByIdAndUpdate(
      id,
      { ...data, paymentSlip: fileUrl, analysisTable: tableData },
      { new: true }
    );

    if (!updatedEnquiry) {
      return NextResponse.json(
        { error: "Enquiry not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Updated successfully.", data: updatedEnquiry },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error in PATCH /api/enquiry/submitSlip:", error);
    return NextResponse.json(
      { error: "An error occurred while updating the enquiry." },
      { status: 500 }
    );
  }
}