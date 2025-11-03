import INVOICE from "@/models/gstinvoice";
import { NextRequest, NextResponse } from "next/server";

// PATCH: Update an existing invoice
export async function PATCH(req: NextRequest) {
  try {
    const { id, invoiceNumber } = await req.json();

    if (!id || !invoiceNumber) {
      return NextResponse.json(
        { error: "ID and invoiceNumber are required." },
        { status: 400 }
      );
    }

    const updatedInvoice = await INVOICE.findOneAndUpdate(
      { _id: id },
      { invoiceNumber },
      { new: true }
    );

    if (!updatedInvoice) {
      return NextResponse.json(
        { error: "Invoice not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        status: true,
        message: "Invoice Number updated successfully",
        data: updatedInvoice,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        status: false,
        message: "Failed to update invoice number",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
