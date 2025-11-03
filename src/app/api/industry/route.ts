import { NextRequest, NextResponse } from "next/server";
import Industry from "@/models/Industry";
import { slugify } from "@/util/slugify";
import Product from "@/models/Product";
import Brand from "@/models/Brand";
import { uploadToS3 } from "@/lib/uploadS3";

export const runtime = "nodejs";

function isFileLike(v: any): v is File {
  return v && typeof v === "object" && typeof v.arrayBuffer === "function" && typeof v.name === "string";
}

export async function POST(req: NextRequest) {
  try {
    const ct = req.headers.get("content-type") || "";
    let industryName = "";
    let imageUrl = "";
    let description = "";
    let industryImageAlt = ""; // NEW: Add alt tag

    if (ct.includes("multipart/form-data")) {
      const formData = await req.formData();
      industryName = String(formData.get("industry") || "").trim();
      description = String(formData.get("description") || "").trim();
      industryImageAlt = String(formData.get("industryImageAlt") || "").trim(); // NEW: Get alt tag
      const imageField = formData.get("industryImage");

      if (isFileLike(imageField) && imageField.size > 0) {
        imageUrl = await uploadToS3(imageField, "industries");
      } else if (typeof imageField === "string" && imageField) {
        imageUrl = imageField;
      }
    } else {
      const body = await req.json();
      industryName = String(body?.industry || "").trim();
      description = String(body?.description || "").trim();
      industryImageAlt = String(body?.industryImageAlt || "").trim(); // NEW: Get alt tag
      imageUrl = body?.industryImage || "";
    }

    if (!industryName) {
      return NextResponse.json(
        { status: false, message: "Industry name is required and must be a string." },
        { status: 400 }
      );
    }

    const slug = slugify(industryName);

    const existingByNameOrSlug = await Industry.findOne({
      $or: [
        { industry: { $regex: new RegExp(`^${industryName}$`, "i") } },
        { slug },
      ],
    });
    if (existingByNameOrSlug) {
      return NextResponse.json(
        { status: false, message: "Industry name or slug already exists." },
        { status: 400 }
      );
    }

    const [product, brand, industry] = await Promise.all([
      Product.findOne({ slug }),
      Brand.findOne({ slug }),
      Industry.findOne({ slug }),
    ]);
    if (product || brand || industry) {
      return NextResponse.json(
        { status: false, message: "This slug is already in use. Please choose a different slug." },
        { status: 400 }
      );
    }

    const doc = new Industry({
      industry: industryName,
      slug,
      industryImage: imageUrl || undefined,
      industryImageAlt, // NEW: Add alt tag
      description,
    });
    const saved = await doc.save();

    return NextResponse.json(
      { status: true, message: "Industry created successfully.", industry: saved },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in POST /api/industry:", error);
    return NextResponse.json(
      { status: false, error: "An error occurred while creating the industry." },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const ct = req.headers.get("content-type") || "";
    let id = "";
    let industryName = "";
    let imageField: any = null;
    let description = "";
    let industryImageAlt = ""; // NEW: Add alt tag

    if (ct.includes("multipart/form-data")) {
      const formData = await req.formData();
      id = String(formData.get("id") || "");
      industryName = String(formData.get("industry") || "").trim();
      description = String(formData.get("description") || "").trim();
      industryImageAlt = String(formData.get("industryImageAlt") || "").trim(); // NEW: Get alt tag
      imageField = formData.get("industryImage");
    } else {
      const body = await req.json();
      id = body?.id || "";
      industryName = String(body?.industry || "").trim();
      description = String(body?.description || "").trim();
      industryImageAlt = String(body?.industryImageAlt || "").trim(); // NEW: Get alt tag
      imageField = body?.industryImage || null;
    }

    if (!id || !industryName) {
      return NextResponse.json(
        { status: false, message: "Valid 'id' and 'industry' are required." },
        { status: 400 }
      );
    }

    const existing = await Industry.findById(id);
    if (!existing) {
      return NextResponse.json({ status: false, message: "Industry not found." }, { status: 404 });
    }

    const sameName =
      (existing.industry || "").trim().toLowerCase() === industryName.toLowerCase();

    if (!sameName) {
      const duplicate = await Industry.findOne({
        _id: { $ne: id },
        industry: { $regex: new RegExp(`^${industryName}$`, "i") },
      });
      if (duplicate) {
        return NextResponse.json(
          { status: false, message: "Industry name already exists." },
          { status: 400 }
        );
      }
    }

    let imageUrl = existing.industryImage || "";

    if (isFileLike(imageField) && imageField.size > 0) {
      imageUrl = await uploadToS3(imageField, "industries");
    } else if (typeof imageField === "string" && imageField) {
      imageUrl = imageField;
    }

    const updated = await Industry.findByIdAndUpdate(
      id,
      {
        $set: {
          industry: industryName,
          industryImage: imageUrl || undefined,
          industryImageAlt, // NEW: Add alt tag
          description,
        },
      },
      { new: true, runValidators: true }
    );

    return NextResponse.json(
      { status: true, message: "Industry updated successfully.", data: updated },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error in PATCH /api/industry:", error);
    return NextResponse.json(
      { status: false, message: "Failed to update industry.", error: error?.message || "Unknown error." },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");

    if (id) {
      const industry = await Industry.findById(id);
      if (!industry) {
        return NextResponse.json({ error: "Industry not found." }, { status: 404 });
      }
      return NextResponse.json(industry, { status: 200 });
    }

    const industries = await Industry.find().sort({ createdAt: -1 });
    return NextResponse.json(industries, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();

    const existing = await Industry.findById(id);
    if (!existing) {
      return NextResponse.json(
        { status: false, message: "Industry not found" },
        { status: 404 }
      );
    }

    const deleted = await Industry.findByIdAndDelete(id);
    return NextResponse.json(
      { status: true, message: "Industry deleted successfully", data: deleted },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}