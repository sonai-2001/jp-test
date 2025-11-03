import ManageEmail from "@/models/manageEmail";
import { NextRequest, NextResponse } from "next/server";

// POST: Create a new ManageEmail
export async function POST(req: NextRequest) {
  try {
    const { primaryEmail, secondaryEmail } = await req.json();

    const newManageEmail = new ManageEmail({
      primaryEmail,
      secondaryEmail,
    });
    await newManageEmail.save();
    return NextResponse.json(
      {
        status: true,
        message: "Manage Email created successfully",
        data: newManageEmail,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        status: false,
        message: "Failed to create Manage Email",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// PATCH: Update an existing ManageEmail
export async function PATCH(req: NextRequest) {
  try {
    const { id, primaryEmail, secondaryEmail } = await req.json();

    if (!id) {
      return NextResponse.json(
        { status: false, message: "Manage Email ID is required" },
        { status: 400 }
      );
    }

    const existingManageEmail = await ManageEmail.findById(id);
    if (!existingManageEmail) {
      return NextResponse.json(
        { status: false, message: "Manage Email not found" },
        { status: 404 }
      );
    }

    Object.assign(existingManageEmail, { primaryEmail, secondaryEmail });
    await existingManageEmail.save();

    return NextResponse.json(
      {
        status: true,
        message: "Manage Email updated successfully",
        data: existingManageEmail,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        status: false,
        message: "Failed to update Manage Email",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// GET: Fetch all Manage Emails or a single Manage Email
export async function GET(req: NextRequest) {
  try {
    const manageEmailData = await ManageEmail.findOne();

    if (!manageEmailData) {
      return NextResponse.json({ error: "Manage Email details missing." }, { status: 404 });
    }

    return NextResponse.json({ data: manageEmailData }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE: Delete an existing Manage Email
export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    const manageEmailData = await ManageEmail.findById(id);
    if (!manageEmailData) {
      return NextResponse.json(
        { success: false, message: "Manage Email not found" },
        { status: 404 }
      );
    }
    const deletedManageEmail = await ManageEmail.findByIdAndDelete(id);
    return NextResponse.json(
      {
        status: true,
        message: "Manage Email deleted successfully",
        data: deletedManageEmail,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
