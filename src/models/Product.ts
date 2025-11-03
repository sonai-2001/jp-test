import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IProduct extends Document {
  images: string[];
  altTags: string[]; // NEW: Add alt tags array
  ProductName: string;
  productModel: { modelName: string; basePrice: string }[];
  category: Types.ObjectId | null;
  brand: Types.ObjectId | null;
  industries: Types.ObjectId[];
  description: string;
  hsn: string;
  slug: string;
  bestseller: boolean;
}

const ProductSchema: Schema = new Schema(
  {
    images: [String],
    altTags: [{ type: String, default: "" }], // NEW: Add alt tags array
    ProductName: { type: String, required: true },
    productModel: [
      {
        modelName: String,
        basePrice: String,
      },
    ],
    category: { type: Schema.Types.ObjectId, ref: "Category" },
    brand: { type: Schema.Types.ObjectId, ref: "Brand" },
    industries: [{ type: Schema.Types.ObjectId, ref: "Industry", default: [] }],
    description: String,
    hsn: String,
    slug: { type: String, unique: true, required: true },
    bestseller: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Product: Model<IProduct> =
  mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema);

export default Product;