import { NextRequest, NextResponse } from "next/server";
import { uploadToS3 } from "@/lib/uploadS3";
import Team from "@/models/ourTeam";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (id) {
      const member = await Team.findById(id);
      if (!member)
        return NextResponse.json({ error: "Not found" }, { status: 404 });
      return NextResponse.json(member, { status: 200 });
    }

    const limit = parseInt(searchParams.get("limit") || "0", 10);
    let query = Team.find({}).sort({ createdAt: -1 });
    if (limit > 0) query = query.limit(limit);

    const list = await query;
    return NextResponse.json(list, { status: 200 });
  } catch (e) {
    console.error("GET /api/team error", e);
    return NextResponse.json(
      { error: "Failed to fetch team members." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const data: Record<string, any> = {};
    let imageInput: any = null;

    for (const [key, value] of formData.entries()) {
      if (key === "image") imageInput = value;
      else data[key] = value;
    }

    if (imageInput) {
      if (typeof imageInput === "string" && imageInput.startsWith("http")) {
        data.image = imageInput;
      } else if (typeof imageInput === "object" && (imageInput as any).name) {
        data.image = await uploadToS3(imageInput as any, "team");
      }
    }

    const created = await new Team(data).save();
    return NextResponse.json(
      { message: "Created", member: created },
      { status: 201 }
    );
  } catch (e) {
    console.error("POST /api/team error", e);
    return NextResponse.json(
      { error: "Failed to create team member." },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const formData = await req.formData();
    const data: Record<string, any> = {};
    let id: string | null = null;
    let imageInput: any = null;

    for (const [key, value] of formData.entries()) {
      if (key === "id") id = value as string;
      else if (key === "image") imageInput = value;
      else data[key] = value;
    }
    if (!id)
      return NextResponse.json({ error: "ID required" }, { status: 400 });

    if (imageInput) {
      if (typeof imageInput === "string" && imageInput.startsWith("http")) {
        data.image = imageInput;
      } else if (typeof imageInput === "object" && (imageInput as any).name) {
        data.image = await uploadToS3(imageInput as any, "team");
      }
    }

    const updated = await Team.findByIdAndUpdate(id, data, { new: true });
    if (!updated)
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(
      { message: "Updated", member: updated },
      { status: 200 }
    );
  } catch (e) {
    console.error("PATCH /api/team error", e);
    return NextResponse.json(
      { error: "Failed to update team member." },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    if (!id)
      return NextResponse.json({ error: "ID required" }, { status: 400 });

    const deleted = await Team.findByIdAndDelete(id);
    if (!deleted)
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ message: "Deleted" }, { status: 200 });
  } catch (e) {
    console.error("DELETE /api/team error", e);
    return NextResponse.json(
      { error: "Failed to delete team member." },
      { status: 500 }
    );
  }
}
