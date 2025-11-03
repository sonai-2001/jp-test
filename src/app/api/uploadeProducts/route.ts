import { NextRequest, NextResponse } from "next/server";
import Busboy from "busboy";
import csvParser from "csv-parser";
import { Readable } from "stream";
import Product from "@/models/Product";
import Category from "@/models/Category";
import Brand from "@/models/Brand";
import { IncomingHttpHeaders } from "http";
import mongoose from "mongoose";
import { slugify } from "@/util/slugify";

export const config = {
  api: {
    bodyParser: false,
  },
};

interface CsvRow {
  Brand: string;
  Category: string;
  Product_Name: string;
  HSN: string;
  Model_BasePrice: string;
  Product_Description: string;
  Images: string;
  [key: string]: string; // Allow dynamic keys for multiple image columns
}

interface ParsedProduct {
  images: string[];
  productName: string;
  productModel: { modelName: string; basePrice: string }[];
  category: string;
  brand: string;
  description: string;
  hsn: string;
  slug: string;
  bestseller: boolean;
}

function parseCsvToProducts(csvData: string): Promise<{
  products: ParsedProduct[];
  brands: Set<string>;
  categories: Set<string>;
}> {
  return new Promise((resolve, reject) => {
    const products: ParsedProduct[] = [];
    const brandSet = new Set<string>();
    const categorySet = new Set<string>();
    const errors: string[] = [];

    const stream = Readable.from([csvData]);

    stream
      .pipe(
        csvParser({
          strict: false,
          mapHeaders: ({ header, index }) => {
            // Handle unnamed columns by giving them a generic name
            return header.trim() || `column_${index}`;
          },
        })
      )
      .on("data", (row: CsvRow) => {
        try {
          const productName = row.Product_Name?.trim();
          if (!productName) return; // skip empty

          // Debug: Log the row keys to see what columns we have
          if (products.length === 0) {
            console.log("📋 CSV Columns detected:", Object.keys(row));
          }

          const brand = row.Brand?.trim() || "";
          const category = row.Category?.trim() || "";

          if (brand) brandSet.add(brand);
          if (category) categorySet.add(category);

          // Parse images - collect from all image columns
          let images: string[] = [];

          // Get all keys from the row that start with "Images" or match image column pattern
          Object.keys(row).forEach((key) => {
            const value = row[key]?.trim();

            // Check if it's an image column (starts with "Images" or is unnamed column with URL)
            if (
              value &&
              (key.toLowerCase().includes("images") ||
                key.match(/^__parsed_extra_\d+$/) || // CSV parser adds these for extra columns
                key.match(/^column_\d+$/) || // Our custom unnamed column names
                value.startsWith("http"))
            ) {
              // Handle both single URLs and newline-separated URLs
              const urls = value
                .split(/[\n\r,;]+/)  // Add semicolon here
                .map((url) => url.trim())
                .filter((url) => url.length > 0 && url.startsWith("http"));

              images.push(...urls);
            }
          });

          // Fallback: if no images found, try the Images column specifically
          if (images.length === 0 && row.Images) {
              images = row.Images.split(/[\n\r,;]+/)  // Add semicolon here too
              .map((url) => url.trim())
              .filter((url) => url.length > 0);
          }

          // Remove duplicates
          images = [...new Set(images)];

          // Debug: Log image count for first product
          if (products.length === 0) {
            console.log(
              `📸 Found ${images.length} images for first product:`,
              images
            );
          }

          // Parse models - handle format like [{USC-12A}, {USC-12B}, ...]
          let productModel: { modelName: string; basePrice: string }[] = [];
          if (row.Model_BasePrice) {
            try {
              // Remove outer brackets and split by }, {
              const cleanedString = row.Model_BasePrice.trim()
                .replace(/^\[/, "")
                .replace(/\]$/, "");

              // Split by comma and extract model names
              const models = cleanedString
                .split(/\},\s*\{/)
                .map((item) => item.replace(/[{}'"]/g, "").trim())
                .filter((item) => item.length > 0);

              productModel = models.map((modelName) => ({
                modelName: modelName,
                basePrice: "0", // Default price since your CSV doesn't have prices
              }));
            } catch (e) {
              console.warn(`Failed to parse models for ${productName}:`, e);
              productModel = [];
            }
          }

          const product: ParsedProduct = {
            images,
            productName,
            productModel,
            category,
            brand,
            description: row.Product_Description || "",
            hsn: row.HSN || "",
            slug: slugify(productName),
            bestseller: false,
          };

          products.push(product);
        } catch (error: any) {
          errors.push(`Row error for ${row.Product_Name}: ${error.message}`);
        }
      })
      .on("end", () => {
        if (errors.length) {
          console.warn("CSV parsing warnings:", errors);
        }
        resolve({ products, brands: brandSet, categories: categorySet });
      })
      .on("error", reject);
  });
}

async function ensureBrands(brands: Set<string>) {
  if (brands.size === 0) return new Map();

  const inputBrands = Array.from(brands)
    .map((b) => b.trim())
    .filter((b) => b);

  // Normalize each brand with its slug
  const normalized = inputBrands.map((b) => ({
    name: b,
    slug: slugify(b),
  }));

  // Collect existing by slug
  const existing = await Brand.find({
    slug: { $in: normalized.map((b) => b.slug) },
  }).lean();

  const existingSlugs = new Set(existing.map((b) => b.slug.toLowerCase()));

  // Filter only new brands
  const newBrands = normalized.filter(
    (b) => !existingSlugs.has(b.slug.toLowerCase())
  );

  // Insert new brands
  if (newBrands.length > 0) {
    await Brand.insertMany(
      newBrands.map((b) => ({
        brandName: b.name,
        brandImage: "",
        brandImageAlt: "",
        slug: b.slug,
      })),
      { ordered: false }
    );
  }

  // Return brand mapping
  const allBrands = await Brand.find({
    slug: { $in: normalized.map((b) => b.slug) },
  });
  return new Map(allBrands.map((b) => [b.brandName, b._id]));
}

async function ensureCategories(categories: Set<string>) {
  if (categories.size === 0) return new Map();

  const inputCategories = Array.from(categories)
    .map((c) => c.trim())
    .filter((c) => c);

  const normalized = inputCategories.map((c) => ({
    name: c,
    slug: slugify(c).toLowerCase(),
  }));

  // Bulk upsert
  const bulkOps = normalized.map((c) => ({
    updateOne: {
      filter: { slug: c.slug },
      update: { $setOnInsert: { category: c.name, slug: c.slug } },
      upsert: true,
    },
  }));

  if (bulkOps.length > 0) {
    await Category.bulkWrite(bulkOps);
  }

  const allCategories = await Category.find({
    slug: { $in: normalized.map((c) => c.slug) },
  });

  return new Map(
    allCategories.map((c) => [c.category, c._id as mongoose.Types.ObjectId])
  );
}

async function uploadProducts(
  products: ParsedProduct[],
  brandMap: Map<string, mongoose.Types.ObjectId>,
  categoryMap: Map<string, mongoose.Types.ObjectId>
) {
  // Check for existing products by slug to avoid duplicates
  const slugs = products.map((p) => p.slug);
  const existingProducts = await Product.find({
    slug: { $in: slugs },
  })
    .select("slug")
    .lean();
  console.log("🚀 ~ uploadProducts ~ existingProducts:", existingProducts)

  const existingSlugs = new Set(existingProducts.map((p) => p.slug));
  console.log("🚀 ~ uploadProducts ~ existingSlugs:", existingSlugs)

  // Filter out products that already exist
  const newProducts = products.filter((p) => !existingSlugs.has(p.slug));
  console.log("🚀 ~ uploadProducts ~ newProducts:", newProducts.length)

  if (newProducts.length === 0) {
    console.log("No new products to insert - all already exist");
    return { inserted: 0, skipped: products.length };
  }

  const productsToInsert = newProducts.map((p) => ({
    images: p.images,
    ProductName: p.productName,
    productModel: p.productModel,
    category: categoryMap.get(p.category) || null,
    brand: brandMap.get(p.brand) || null,
    description: p.description,
    hsn: p.hsn,
    slug: p.slug,
    bestseller: p.bestseller,
  }));

  try {
    const result = await Product.insertMany(productsToInsert, {
      ordered: false,
    });
    return {
      inserted: result.length,
      skipped: products.length - newProducts.length,
    };
  } catch (error: any) {
  if (error.code === 11000) {
    console.warn("Duplicate key error details:");
    error.writeErrors?.forEach((err: any, idx: number) => {
      console.log(`Duplicate #${idx + 1}:`, err.err?.op?.slug);
    });

    const inserted =
      productsToInsert.length - (error.writeErrors?.length || 0);

    return {
      inserted,
      skipped: error.writeErrors?.length || 0,
      duplicates: error.writeErrors?.map((err: any) => err.err?.op) || [],
    };
  }
  throw error;
}
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  return new Promise((resolve, reject) => {
    const headers = Object.fromEntries(
      req.headers.entries()
    ) as IncomingHttpHeaders;
    const busboy = Busboy({ headers });
    let csvData = "";

    busboy.on("file", (fieldname, file) => {
      let fileContent = "";
      file.on("data", (chunk: Buffer) => {
        fileContent += chunk.toString();
      });

      file.on("end", async () => {
        csvData = fileContent;

        try {
          const { products, brands, categories } = await parseCsvToProducts(
            csvData
          );
          console.log(
            `📊 Parsed: ${products.length} products, ${brands.size} brands, ${categories.size} categories`
          );

          console.log('📊 Parsed:', products.length, 'products,', brands.size, 'brands,', categories.size, 'categories');

          // Create or ensure brands and categories
          const brandMap = await ensureBrands(brands);
          const categoryMap = await ensureCategories(categories);

          // Insert products with proper references
          const result = await uploadProducts(products, brandMap, categoryMap);
          console.log("🚀 ~ POST ~ result:", result)

          resolve(
            NextResponse.json({
              status: true,
              message: "Products processed successfully",
              data: {
                totalParsed: products.length,
                inserted: result.inserted,
                skipped: result.skipped,
              },
            })
          );
        } catch (error: any) {
          console.error("Error processing CSV:", error);
          resolve(
            NextResponse.json(
              {
                status: false,
                message: "Failed to upload",
                error: error.message,
              },
              { status: 500 }
            )
          );
        }
      });

      file.on("error", (error) => {
        console.error("File read error:", error);
        resolve(
          NextResponse.json(
            { status: false, message: "File error", error: error.message },
            { status: 500 }
          )
        );
      });
    });

    busboy.on("finish", () => {
      console.log("✅ Form parsing finished");
    });

    const readable = Readable.from(req.body as any);
    readable.pipe(busboy);
  });
}
