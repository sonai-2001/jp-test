import Brand from "@/models/Brand";
import { NextRequest, NextResponse } from "next/server";
import { uploadToS3 } from "@/lib/uploadS3";
import { slugify } from "@/util/slugify";
import mongoose from "mongoose";
import Catalogue from "@/models/Catalogue";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const brandData: Record<string, any> = {};
    let brandImageFile: any = null;

    for (const [key, value] of formData.entries()) {
      if (key === "brandImage" && value instanceof Blob) {
        brandImageFile = value;
      } else {
        brandData[key] = value;
      }
    }

    // NEW: normalize optional values that may arrive as empty strings
    if (brandData.selectedCatalogue === "") delete brandData.selectedCatalogue;
    if (brandData.catalogueFile === "") delete brandData.catalogueFile;
    if (brandData.brandImageAlt === "") brandData.brandImageAlt = ""; // NEW: Handle alt tag

    // NEW: if selectedCatalogue is provided and no catalogueFile string was sent,
    // derive catalogueFile from the Catalogue document
    if (brandData.selectedCatalogue && !brandData.catalogueFile) {
      if (!mongoose.Types.ObjectId.isValid(String(brandData.selectedCatalogue))) {
        return NextResponse.json(
          { status: false, message: "Invalid selectedCatalogue id." },
          { status: 400 }
        );
      }
      const cat = await Catalogue.findById(brandData.selectedCatalogue).select("catalogueFile");
      if (!cat) {
        return NextResponse.json(
          { status: false, message: "Selected catalogue not found." },
          { status: 404 }
        );
      }
      brandData.catalogueFile = cat.catalogueFile || "";
    }

    const brandName = brandData.brandName.trim();
    const slug = slugify(brandName);
    brandData.slug = slug;

    // Check if category already exists (case-insensitive)
    const existingBrandName = await Brand.findOne({
      brandName: { $regex: new RegExp(`^${brandName}$`, "i") },
    });
    const existingBrandSlug = await Brand.findOne({ slug });

    if (existingBrandName || existingBrandSlug) {
      return NextResponse.json(
        { status: false, message: "Brand name or slug already exists." },
        { status: 400 }
      );
    }

    // Upload brand image to S3
    const brandImageUrl = brandImageFile
      ? await uploadToS3(brandImageFile, "brands")
      : null;
    if (brandImageUrl) {
      brandData.brandImage = brandImageUrl;
    }

    const newBrand = new Brand(brandData);
    const savedBrand = await newBrand.save();

    return NextResponse.json(
      {
        status: true,
        message: "Brand created successfully",
        data: savedBrand,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        status: false,
        message: "Failed to create brand",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const formData = await req.formData();
    const brandData: Record<string, any> = {};
    let brandImageFile: any = null;
    let id: string | null = null;

    for (const [key, value] of formData.entries()) {
      if (key === "id") {
        id = value as string;
      } else if (key === "brandImage" && value instanceof Blob) {
        brandImageFile = value;
      } else {
        brandData[key] = value;
      }
    }

    if (!id) {
      return NextResponse.json(
        { status: false, message: "Brand ID is required" },
        { status: 400 }
      );
    }

    // NEW: normalize optional values that may arrive as empty strings
    if (brandData.selectedCatalogue === "") delete brandData.selectedCatalogue;
    if (brandData.catalogueFile === "") delete brandData.catalogueFile;
    if (brandData.brandImageAlt === "") brandData.brandImageAlt = ""; // NEW: Handle alt tag

    const existingBrand = await Brand.findById(id);
    if (!existingBrand) {
      return NextResponse.json(
        { status: false, message: "Brand not found" },
        { status: 404 }
      );
    }

    // NEW: if selectedCatalogue is provided and no catalogueFile string was sent,
    // derive catalogueFile from the Catalogue document
    if (brandData.selectedCatalogue && !brandData.catalogueFile) {
      if (!mongoose.Types.ObjectId.isValid(String(brandData.selectedCatalogue))) {
        return NextResponse.json(
          { status: false, message: "Invalid selectedCatalogue id." },
          { status: 400 }
        );
      }
      const cat = await Catalogue.findById(brandData.selectedCatalogue).select("catalogueFile");
      if (!cat) {
        return NextResponse.json(
          { status: false, message: "Selected catalogue not found." },
          { status: 404 }
        );
      }
      brandData.catalogueFile = cat.catalogueFile || "";
    }

    const brandName = brandData.brandName.trim();
    const slug = slugify(brandName);
    brandData.slug = slug;

    // Check if category already exists (case-insensitive)
    const existingBrandName = await Brand.findOne({
      brandName: { $regex: new RegExp(`^${brandName}$`, "i") },
      _id: { $ne: id },
    });

    const existingBrandSlug = await Brand.findOne({ slug, _id: { $ne: id } });
    if (existingBrandName || existingBrandSlug) {
      return NextResponse.json(
        { status: false, message: "Brand name or slug already exists." },
        { status: 400 }
      );
    }

    // Upload brand image to S3
    const brandImageUrl = brandImageFile
      ? await uploadToS3(brandImageFile, "brands")
      : null;
    if (brandImageUrl) {
      brandData.brandImage = brandImageUrl;
    }

    Object.assign(existingBrand, brandData);
    const updatedBrand = await existingBrand.save();

    return NextResponse.json(
      {
        status: true,
        message: "Brand updated successfully",
        data: updatedBrand,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        status: false,
        message: "Failed to update brand",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");

    if (id) {
      const brandData = await Brand.findById(id);
      if (!brandData) {
        return NextResponse.json(
          { error: "Brand not found." },
          { status: 404 }
        );
      }
      return NextResponse.json(brandData, { status: 200 });
    } else {
      const brandData = await Brand.find().sort({ createdAt: -1 });
      return NextResponse.json(brandData, { status: 200 });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    const brandData = await Brand.findById(id);
    if (!brandData) {
      return NextResponse.json(
        { success: false, message: "Brand not found" },
        { status: 404 }
      );
    }
    const deletedBrand = await Brand.findByIdAndDelete(id);
    return NextResponse.json(
      {
        status: true,
        message: "Brand deleted successfully",
        data: deletedBrand,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
