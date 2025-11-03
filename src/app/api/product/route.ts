import { NextRequest, NextResponse } from "next/server";
import Product from "@/models/Product";
import { uploadToS3 } from "@/lib/uploadS3";
import Category from "@/models/Category";
import Brand from "@/models/Brand";
import Industry from "@/models/Industry";

const isObjectId = (val: string) => /^[0-9a-fA-F]{24}$/.test(val || "");

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

   // In the single product fetch section:
if (id && id !== "product") {
  const product = await Product.findById(id);
  if (!product) {
    return NextResponse.json({ error: "Product not found." }, { status: 404 });
  }

  const categoryDoc = product.category ? await Category.findById(product.category) : null;
  const brandDoc = product.brand ? await Brand.findById(product.brand) : null;

  // Handle both industries (array) and industry (single) for backward compatibility
  let industryDocs: any[] = [];
  if ((product as any).industries && Array.isArray((product as any).industries) && (product as any).industries.length) {
    industryDocs = await Industry.find({ _id: { $in: (product as any).industries } });
  } else if ((product as any).industry) {
    const ind = await Industry.findById((product as any).industry);
    industryDocs = ind ? [ind] : [];
  }

  return NextResponse.json(
    {
      ...product.toObject(),
      category: categoryDoc ? { _id: categoryDoc._id, category: categoryDoc.category } : null,
      brand: brandDoc ? { _id: brandDoc._id, brandName: brandDoc.brandName } : null,
      industries: industryDocs.map((i) => ({ _id: i._id, industry: i.industry, slug: i.slug })),
      // Alt tags are already included in the product object
    },
    { status: 200 }
  );
}
    // Build filters using $and to combine multiple conditions safely
    const andConditions: any[] = [];

    // --- CATEGORY FILTERS ---
    const slug = searchParams.get("slug"); // category slug
    let category = searchParams.get("category"); // category id(s) or name(s)

    if (slug) {
      const categoryDoc = await Category.findOne({
        slug: { $regex: `^${decodeURIComponent(slug)}$`, $options: "i" },
      });
      if (categoryDoc) {
        andConditions.push({ category: categoryDoc._id });
      } else {
        return NextResponse.json(
          { totalProducts: 0, page: 1, limit: 12, totalPages: 0, products: [] },
          { status: 200 }
        );
      }
    } else if (category) {
      category = decodeURIComponent(category);
      const categoryArr = category.split(",").map((c) => c.trim()).filter(Boolean);
      if (categoryArr.length) {
        if (categoryArr.every(isObjectId)) {
          andConditions.push({ category: { $in: categoryArr } });
        } else {
          const categoryDocs = await Category.find({ category: { $in: categoryArr } });
          if (categoryDocs.length) {
            andConditions.push({ category: { $in: categoryDocs.map((c) => c._id) } });
          } else {
            return NextResponse.json(
              { totalProducts: 0, page: 1, limit: 12, totalPages: 0, products: [] },
              { status: 200 }
            );
          }
        }
      }
    }

    // --- BRAND FILTERS ---
    const brandSlug = searchParams.get("brandSlug");
    let brand = searchParams.get("brand"); // brand id(s) or name(s)

    if (brandSlug) {
      const brandDoc = await Brand.findOne({
        slug: { $regex: `^${decodeURIComponent(brandSlug)}$`, $options: "i" },
      });
      if (brandDoc) {
        andConditions.push({ brand: brandDoc._id });
      } else {
        return NextResponse.json(
          { totalProducts: 0, page: 1, limit: 12, totalPages: 0, products: [] },
          { status: 200 }
        );
      }
    } else if (brand) {
      brand = decodeURIComponent(brand);
      const brandArr = brand.split(",").map((b) => b.trim()).filter(Boolean);
      if (brandArr.length) {
        if (brandArr.every(isObjectId)) {
          andConditions.push({ brand: { $in: brandArr } });
        } else {
          const brandDocs = await Brand.find({ brandName: { $in: brandArr } });
          if (brandDocs.length) {
            andConditions.push({ brand: { $in: brandDocs.map((b) => b._id) } });
          } else {
            return NextResponse.json(
              { totalProducts: 0, page: 1, limit: 12, totalPages: 0, products: [] },
              { status: 200 }
            );
          }
        }
      }
    }

    // --- INDUSTRY FILTERS (supports industries[] array or legacy industry field) ---
    const industrySlug = searchParams.get("industrySlug");
    let industry = searchParams.get("industry"); // id(s) or name(s)

    if (industrySlug) {
      const industryDoc = await Industry.findOne({
        slug: { $regex: `^${decodeURIComponent(industrySlug)}$`, $options: "i" },
      });
      if (industryDoc) {
        andConditions.push({ $or: [{ industries: industryDoc._id }, { industry: industryDoc._id }] });
      } else {
        return NextResponse.json(
          { totalProducts: 0, page: 1, limit: 12, totalPages: 0, products: [] },
          { status: 200 }
        );
      }
    } else if (industry) {
      industry = decodeURIComponent(industry);
      const indsArr = industry.split(",").map((i) => i.trim()).filter(Boolean);
      if (indsArr.length) {
        if (indsArr.every(isObjectId)) {
          andConditions.push({ $or: [{ industries: { $in: indsArr } }, { industry: { $in: indsArr } }] });
        } else {
          const indsDocs = await Industry.find({ industry: { $in: indsArr } });
          if (indsDocs.length) {
            const ids = indsDocs.map((i) => i._id);
            andConditions.push({ $or: [{ industries: { $in: ids } }, { industry: { $in: ids } }] });
          } else {
            return NextResponse.json(
              { totalProducts: 0, page: 1, limit: 12, totalPages: 0, products: [] },
              { status: 200 }
            );
          }
        }
      }
    }

    // --- SEARCH FILTER ---
    const search = searchParams.get("search");
    if (search) {
      const searchTerm = search.trim();
      const [categoryDocs, brandDocs, industryDocs] = await Promise.all([
        Category.find({ category: { $regex: searchTerm, $options: "i" } }),
        Brand.find({ brandName: { $regex: searchTerm, $options: "i" } }),
        Industry.find({ industry: { $regex: searchTerm, $options: "i" } }),
      ]);

      const categoryIds = categoryDocs.map((cat) => cat._id);
      const brandIds = brandDocs.map((brand) => brand._id);
      const industryIds = industryDocs.map((ind) => ind._id);

      const searchOr: any[] = [
        { ProductName: { $regex: searchTerm, $options: "i" } },
        { category: { $in: categoryIds } },
        { brand: { $in: brandIds } },
        { industries: { $in: industryIds } }, // industries array
        { industry: { $in: industryIds } }, // legacy single field
      ];

      andConditions.push({ $or: searchOr });
    }

    // --- SORTING ---
    const sortParam = searchParams.get("sort");
    const sortNewest = searchParams.get("newest") === "true";
    const sortBestseller = searchParams.get("bestseller") === "true";
    let sortQuery: any = {};

    if (sortParam === "name_asc") sortQuery = { ProductName: 1 };
    else if (sortParam === "name_desc") sortQuery = { ProductName: -1 };
    if (sortNewest) sortQuery = { updatedAt: -1 };
    if (sortBestseller) sortQuery = { bestseller: -1, updatedAt: -1 };

    // --- PAGINATION ---
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "12", 10);
    const skip = (page - 1) * limit;

    const query = andConditions.length ? { $and: andConditions } : {};

    // --- QUERY PRODUCTS ---
    const totalProducts = await Product.countDocuments(query);
    const products = await Product.find(query).sort(sortQuery).skip(skip).limit(limit);

    // --- MAP CATEGORY, BRAND, INDUSTRY NAMES ---
    const finalList = await Promise.all(
      products.map(async (item) => {
        const categoryDoc = item.category ? await Category.findById(item.category) : null;
        const brandDoc = item.brand ? await Brand.findById(item.brand) : null;

        // Collect industries (supports both fields)
        let inds: any[] = [];
        const indsIds: string[] = [];
        if ((item as any).industries && Array.isArray((item as any).industries) && (item as any).industries.length) {
          (item as any).industries.forEach((i: any) => i && indsIds.push(i.toString()));
        }
        if ((item as any).industry) {
          indsIds.push((item as any).industry.toString());
        }
        if (indsIds.length) {
          const docs = await Industry.find({ _id: { $in: indsIds } });
          inds = docs.map((d) => d.industry);
        }

        return {
          ...item.toObject(),
          category: categoryDoc ? categoryDoc.category : null,
          brand: brandDoc ? brandDoc.brandName : null,
          industries: inds, // array of industry names
        };
      })
    );

    return NextResponse.json(
      {
        totalProducts,
        page,
        limit,
        totalPages: Math.ceil(totalProducts / limit),
        products: finalList,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error in GET /api/product:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching the products." },
      { status: 500 }
    );
  }
}

// POST: Create a new product
// POST: Create a new product
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const productData: Record<string, any> = {};
    const imageFiles: any[] = [];
    const altTags: string[] = [];
    const productModel: any[] = [];

    for (const [key, value] of formData.entries()) {
      if (key.startsWith("images")) {
        imageFiles.push(value);
      } else if (key.startsWith("altTags")) {
        altTags.push(value as string);
      } else if (key.startsWith("productModel")) {
        // FIX: Correct regex pattern to match productModel[0][modelName] format
        const match = key.match(/productModel\[(\d+)\]\[(\w+)\]/);
        if (match) {
          const index = parseInt(match[1], 10);
          const field = match[2];
          if (!productModel[index]) productModel[index] = { modelName: "", basePrice: "" };
          productModel[index][field] = value as string;
        }
      } else {
        productData[key] = value;
      }
    }

    // Parse industries (JSON array of ids)
    if (typeof productData.industries === "string") {
      try {
        const parsed = JSON.parse(productData.industries);
        productData.industries = Array.isArray(parsed) ? parsed.filter(Boolean) : [];
      } catch {
        productData.industries = [];
      }
    } else if (!productData.industries) {
      productData.industries = [];
    }

    // Upload images to S3 (support string URLs as-is)
    const imageUrls = await Promise.all(
      imageFiles.map(async (file: any) => {
        if (typeof file === "string") return file;
        return await uploadToS3(file, "products");
      })
    );

    productData.images = imageUrls;
    productData.altTags = altTags;
    productData.productModel = productModel;

    // Unique slug
    const existingSlug = await Product.findOne({ slug: productData.slug });
    if (existingSlug) {
      return NextResponse.json(
        { status: false, error: "Slug already exists please update 'Product Name'" },
        { status: 400 }
      );
    }

    const newProduct = new Product(productData);
    const savedProduct = await newProduct.save();
    return NextResponse.json(
      { message: "Product created successfully.", product: savedProduct },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error in POST /api/product:", error);
    return NextResponse.json(
      { error: "An error occurred while creating the product." },
      { status: 500 }
    );
  }
}

// PATCH: Update an existing product
export async function PATCH(req: NextRequest) {
  try {
    const formData = await req.formData();
    const productData: Record<string, any> = {};
    const imageFiles: any[] = [];
    const altTags: string[] = [];
    const productModel: any[] = [];
    let id: string | null = null;

    for (const [key, value] of formData.entries()) {
      if (key === "id") {
        id = value as string;
      } else if (key.startsWith("images")) {
        imageFiles.push(value);
      } else if (key.startsWith("altTags")) {
        altTags.push(value as string);
      } else if (key.startsWith("productModel")) {
        // FIX: Correct regex pattern to match productModel[0][modelName] format
        const match = key.match(/productModel\[(\d+)\]\[(\w+)\]/);
        if (match) {
          const index = parseInt(match[1], 10);
          const field = match[2];
          if (!productModel[index]) productModel[index] = { modelName: "", basePrice: "" };
          productModel[index][field] = value as string;
        }
      } else {
        productData[key] = value;
      }
    }

    if (!id) {
      return NextResponse.json({ error: "Product ID is required." }, { status: 400 });
    }

    // Parse industries
    if (typeof productData.industries === "string") {
      try {
        const parsed = JSON.parse(productData.industries);
        productData.industries = Array.isArray(parsed) ? parsed.filter(Boolean) : [];
      } catch {
        productData.industries = [];
      }
    } else if (!productData.industries) {
      productData.industries = [];
    }

    const imageUrls = await Promise.all(
      imageFiles.map(async (file: any) => {
        if (typeof file === "string" && file.includes("amazonaws.com")) return file;
        if (typeof file === "object" && (file as any).name) {
          return await uploadToS3(file as any, "products");
        }
        return null;
      })
    );

    productData.images = imageUrls;
    productData.altTags = altTags;
    productData.productModel = productModel;

    const updatedProduct = await Product.findByIdAndUpdate(id, productData, { new: true });
    if (!updatedProduct) {
      return NextResponse.json({ error: "Product not found." }, { status: 404 });
    }
    return NextResponse.json(
      { message: "Product updated successfully.", product: updatedProduct },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error in PATCH /api/product:", error);
    return NextResponse.json(
      { error: "An error occurred while updating the product." },
      { status: 500 }
    );
  }
}

// DELETE: Delete an existing product
export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct) {
      return NextResponse.json({ error: "Product not found." }, { status: 404 });
    }
    return NextResponse.json({ message: "Product deleted successfully." }, { status: 200 });
  } catch (error: any) {
    console.error("Error in DELETE /api/product:", error);
    return NextResponse.json(
      { error: "An error occurred while deleting the product." },
      { status: 500 }
    );
  }
}