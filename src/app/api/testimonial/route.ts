import { NextRequest, NextResponse } from "next/server";
import Testimonial from "@/models/Testimonial";
import { uploadToS3 } from "@/lib/uploadS3";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (id) {
      const t = await Testimonial.findById(id);
      if (!t) return NextResponse.json({ error: "Not found" }, { status: 404 });
      return NextResponse.json(t, { status: 200 });
    }

    const limit = parseInt(searchParams.get("limit") || "0", 10);
    let query = Testimonial.find({}).sort({ createdAt: -1 });
    if (limit > 0) query = query.limit(limit);

    const list = await query;
    return NextResponse.json(list, { status: 200 });
  } catch (e) {
    console.error("GET /api/testimonial error", e);
    return NextResponse.json({ error: "Failed to fetch testimonials." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const data: Record<string, any> = {};
    let avatarInput: any = null;

    for (const [key, value] of formData.entries()) {
      if (key === "avatar") avatarInput = value;
      else data[key] = value;
    }

    if (data.rating !== undefined) {
      data.rating = Math.max(1, Math.min(5, parseInt(data.rating || "5", 10)));
    }

    if (avatarInput) {
      if (typeof avatarInput === "string" && avatarInput.startsWith("http")) {
        data.avatar = avatarInput;
      } else if (typeof avatarInput === "object" && (avatarInput as any).name) {
        data.avatar = await uploadToS3(avatarInput as any, "testimonials");
      }
    }

    const created = await new Testimonial(data).save();
    return NextResponse.json({ message: "Created", testimonial: created }, { status: 201 });
  } catch (e) {
    console.error("POST /api/testimonial error", e);
    return NextResponse.json({ error: "Failed to create testimonial." }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const formData = await req.formData();
    const data: Record<string, any> = {};
    let id: string | null = null;
    let avatarInput: any = null;

    for (const [key, value] of formData.entries()) {
      if (key === "id") id = value as string;
      else if (key === "avatar") avatarInput = value;
      else data[key] = value;
    }
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    if (data.rating !== undefined) {
      data.rating = Math.max(1, Math.min(5, parseInt(data.rating || "5", 10)));
    }

    if (avatarInput) {
      if (typeof avatarInput === "string" && avatarInput.startsWith("http")) {
        data.avatar = avatarInput;
      } else if (typeof avatarInput === "object" && (avatarInput as any).name) {
        data.avatar = await uploadToS3(avatarInput as any, "testimonials");
      }
    }

    const updated = await Testimonial.findByIdAndUpdate(id, data, { new: true });
    if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ message: "Updated", testimonial: updated }, { status: 200 });
  } catch (e) {
    console.error("PATCH /api/testimonial error", e);
    return NextResponse.json({ error: "Failed to update testimonial." }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    const deleted = await Testimonial.findByIdAndDelete(id);
    if (!deleted) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ message: "Deleted" }, { status: 200 });
  } catch (e) {
    console.error("DELETE /api/testimonial error", e);
    return NextResponse.json({ error: "Failed to delete testimonial." }, { status: 500 });
  }
}