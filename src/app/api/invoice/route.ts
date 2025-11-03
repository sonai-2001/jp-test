import INVOICE from "@/models/gstinvoice";
import { NextRequest, NextResponse } from "next/server";
import { uploadToS3 } from "@/lib/uploadS3";

// POST: Create a new invoice
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const body: Record<string, any> = {};
    let signatoryFile: any = null;

    for (const [key, value] of formData.entries()) {
      if (key === "signatory" && value instanceof Blob) {
        signatoryFile = value;
      } else {
        body[key] = value;
      }
    }

    // Upload signatory image to S3
    const signatoryUrl = signatoryFile ? await uploadToS3(signatoryFile, "invoiceSign") : null;
    if (signatoryUrl) {
      body.signatory = signatoryUrl;
    }

    const newINVOICE = new INVOICE(body);
    await newINVOICE.save();
    return NextResponse.json(
      {
        status: true,
        message: "INVOICE created successfully",
        data: newINVOICE,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        status: false,
        message: "Failed to create INVOICE",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// PATCH: Update an existing invoice
export async function PATCH(req: NextRequest) {
  try {
    const formData = await req.formData();
    const body: Record<string, any> = {};
    let signatoryFile: any = null;
    let id: string | null = null;

    for (const [key, value] of formData.entries()) {
      if (key === "id") {
        id = value as string;
      } else if (key === "signatory") {
        signatoryFile = value;
      } else {
        body[key] = value;
      }
    }

    if (!id) {
      return NextResponse.json(
        { status: false, message: "Invoice ID is required" },
        { status: 400 }
      );
    }

    const existingINVOICE = await INVOICE.findById(id);
    if (!existingINVOICE) {
      return NextResponse.json(
        { status: false, message: "Invoice not found" },
        { status: 404 }
      );
    }

    // Upload signatory image to S3
    const signatoryUrl = typeof signatoryFile  !== "string" ? await uploadToS3(signatoryFile, "invoiceSign") : signatoryFile;
    if (signatoryUrl) {
      body.signatory = signatoryUrl;
    }

    Object.assign(existingINVOICE, body);
    await existingINVOICE.save();

    return NextResponse.json(
      {
        status: true,
        message: "Invoice updated successfully",
        data: existingINVOICE,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        status: false,
        message: "Failed to update INVOICE",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// GET: Fetch all invoices or a single invoice
export async function GET(req: NextRequest) {
  try {
    const INVOICEData = await INVOICE.findOne();

    if (!INVOICEData) {
      return NextResponse.json({ error: "invoice details missing." }, { status: 404 });
    }

    return NextResponse.json({ data: INVOICEData }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE: Delete an existing invoice
export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    const INVOICEData = await INVOICE.findById(id);
    if (!INVOICEData) {
      return NextResponse.json(
        { success: false, message: "INVOICE not found" },
        { status: 404 }
      );
    }
    const deletedINVOICE = await INVOICE.findByIdAndDelete(id);
    return NextResponse.json(
      {
        status: true,
        message: "INVOICE deleted successfully",
        data: deletedINVOICE,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
