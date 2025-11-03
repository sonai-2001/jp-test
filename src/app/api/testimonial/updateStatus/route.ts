import { NextRequest, NextResponse } from "next/server";
import Testimonial from "@/models/Testimonial";

export async function PATCH(req: NextRequest) {
  try {
    const { id, published } = await req.json();
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    const updated = await Testimonial.findByIdAndUpdate(
      id,
      { published: published === true || published === "true" },
      { new: true }
    );
    if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json({ message: "Status updated", testimonial: updated }, { status: 200 });
  } catch (e) {
    console.error("PATCH /api/testimonial/updateStatus error", e);
    return NextResponse.json({ error: "Failed to update status." }, { status: 500 });
  }
}