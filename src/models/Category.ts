import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICategory extends Document {
  category: string;
  slug: string;
  categoryImage?: string;
  categoryImageAlt?: string; // NEW: Add alt tag for category image
  description?: string;
}

const categorySchema: Schema = new Schema(
  {
    category: { type: String, unique: true, required: true },
    slug: { type: String, unique: true, required: true },
    categoryImage: { type: String },
    categoryImageAlt: { type: String, default: "" }, // NEW: Add alt tag for category image
    description: { type: String, default: "" }
  },
  { timestamps: true }
);

const Category: Model<ICategory> =
  mongoose.models.Category || mongoose.model<ICategory>("Category", categorySchema);

export default Category;