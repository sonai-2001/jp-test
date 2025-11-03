import { NextRequest, NextResponse } from "next/server";
import Category from "@/models/Category";
import { slugify } from "@/util/slugify";
import Product from "@/models/Product";
import Brand from "@/models/Brand";
import Industry from "@/models/Industry";
import { uploadToS3 } from "@/lib/uploadS3";

export const runtime = "nodejs";

function isFileLike(v: any): v is File {
  return v && typeof v === "object" && typeof v.arrayBuffer === "function" && typeof v.name === "string";
}

export async function POST(req: NextRequest) {
  try {
    const ct = req.headers.get("content-type") || "";
    let categoryName = "";
    let imageUrl = "";
    let description = "";
    let categoryImageAlt = ""; // NEW: Add alt tag

    if (ct.includes("multipart/form-data")) {
      const formData = await req.formData();
      categoryName = String(formData.get("category") || "").trim();
      description = String(formData.get("description") || "").trim();
      categoryImageAlt = String(formData.get("categoryImageAlt") || "").trim(); // NEW: Get alt tag
      const imageField = formData.get("categoryImage");
      if (isFileLike(imageField) && imageField.size > 0) {
        imageUrl = await uploadToS3(imageField, "categories");
      } else if (typeof imageField === "string" && imageField) {
        imageUrl = imageField;
      }
    } else {
      const body = await req.json();
      categoryName = String(body?.category || "").trim();
      description = String(body?.description || "").trim();
      categoryImageAlt = String(body?.categoryImageAlt || "").trim(); // NEW: Get alt tag
      imageUrl = body?.categoryImage || "";
    }

    if (!categoryName) {
      return NextResponse.json(
        { status: false, message: "Category name is required and must be a string." },
        { status: 400 }
      );
    }

    const slug = slugify(categoryName);

    // Check duplicates in category collection
    const existingCategory = await Category.findOne({
      $or: [
        { category: { $regex: new RegExp(`^${categoryName}$`, "i") } },
        { slug }
      ]
    });
    if (existingCategory) {
      return NextResponse.json(
        { status: false, message: "Category name or slug already exists." },
        { status: 400 }
      );
    }

    // Global slug conflict
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

    const newCategory = new Category({
      category: categoryName,
      slug,
      categoryImage: imageUrl || undefined,
      categoryImageAlt, // NEW: Add alt tag
      description,
    });
    const savedCategory = await newCategory.save();

    return NextResponse.json(
      { status: true, message: "Category created successfully.", category: savedCategory },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in POST /api/category:", error);
    return NextResponse.json(
      { status: false, error: "An error occurred while creating the category." },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const ct = req.headers.get("content-type") || "";
    let id = "";
    let categoryName = "";
    let imageField: any = null;
    let description = "";
    let categoryImageAlt = ""; // NEW: Add alt tag

    if (ct.includes("multipart/form-data")) {
      const formData = await req.formData();
      id = String(formData.get("id") || "");
      categoryName = String(formData.get("category") || "").trim();
      description = String(formData.get("description") || "").trim();
      categoryImageAlt = String(formData.get("categoryImageAlt") || "").trim(); // NEW: Get alt tag
      imageField = formData.get("categoryImage");
    } else {
      const body = await req.json();
      id = body?.id || "";
      categoryName = String(body?.category || "").trim();
      description = String(body?.description || "").trim();
      categoryImageAlt = String(body?.categoryImageAlt || "").trim(); // NEW: Get alt tag
      imageField = body?.categoryImage || null;
    }

    if (!id || !categoryName) {
      return NextResponse.json(
        { status: false, message: "Valid 'id' and 'category' are required." },
        { status: 400 }
      );
    }

    const existing = await Category.findById(id);
    if (!existing) {
      return NextResponse.json({ status: false, message: "Category not found." }, { status: 404 });
    }

    const sameName = (existing.category || "").trim().toLowerCase() === categoryName.toLowerCase();

    if (!sameName) {
      const duplicateCategory = await Category.findOne({
        _id: { $ne: id },
        category: { $regex: new RegExp(`^${categoryName}$`, "i") },
      });
      if (duplicateCategory) {
        return NextResponse.json(
          { status: false, message: "Category name already exists." },
          { status: 400 }
        );
      }
    }

    let imageUrl = existing.categoryImage || "";
    if (isFileLike(imageField) && imageField.size > 0) {
      imageUrl = await uploadToS3(imageField, "categories");
    } else if (typeof imageField === "string" && imageField) {
      imageUrl = imageField;
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      { 
        $set: { 
          category: categoryName, 
          categoryImage: imageUrl || undefined, 
          categoryImageAlt, // NEW: Add alt tag
          description 
        } 
      },
      { new: true, runValidators: true }
    );

    return NextResponse.json(
      { status: true, message: "Category updated successfully.", data: updatedCategory },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in PATCH /api/category:", error);
    return NextResponse.json(
      { status: false, message: "Failed to update category.", error: error instanceof Error ? error.message : "Unknown error." },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");

    if (id) {
      const categoryData = await Category.findById(id);
      if (!categoryData) {
        return NextResponse.json({ error: "Category not found." }, { status: 404 });
      }
      return NextResponse.json(categoryData, { status: 200 });
    }

    const categoryData = await Category.find().sort({ createdAt: -1 });
    return NextResponse.json(categoryData, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    const categoryData = await Category.findById(id);
    if (!categoryData) {
      return NextResponse.json({ success: false, message: "Category not found" }, { status: 404 });
    }
    const deletedCategory = await Category.findByIdAndDelete(id);
    return NextResponse.json(
      { status: true, message: "Category deleted successfully", data: deletedCategory },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}