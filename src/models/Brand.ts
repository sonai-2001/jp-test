import mongoose, { Schema, Document, Model } from "mongoose";

export interface IBrand extends Document {
  brandName: string;
  brandImage: string;
  brandImageAlt: string; // NEW: Add alt tag for brand image
  slug: string;
  selectedCatalogue?: mongoose.Types.ObjectId;
  catalogueFile?: string;
}

const BrandSchema: Schema = new Schema(
  {
    brandName: { type: String, unique: true, required: true },
    brandImage: { type: String },
    brandImageAlt: { type: String, default: "" }, // NEW: Add alt tag for brand image
    slug: { type: String, unique: true, required: true },
    selectedCatalogue: { type: Schema.Types.ObjectId, ref: "catalogue" },
    catalogueFile: { type: String },
  },
  { timestamps: true }
);

const Brand: Model<IBrand> =
  mongoose.models.Brand || mongoose.model<IBrand>("Brand", BrandSchema);

export default Brand;
