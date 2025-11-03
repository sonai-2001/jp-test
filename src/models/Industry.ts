import mongoose, { Schema, Document, Model } from "mongoose";

export interface IIndustry extends Document {
  industry: string;
  slug: string;
  industryImage?: string;
  industryImageAlt?: string; // NEW: Add alt tag for industry image
  description?: string;
}

const industrySchema: Schema = new Schema(
  {
    industry: { type: String, unique: true, required: true },
    slug: { type: String, unique: true, required: true },
    industryImage: { type: String },
    industryImageAlt: { type: String, default: "" }, // NEW: Add alt tag for industry image
    description: { type: String, default: "" },
  },
  { timestamps: true }
);

const Industry: Model<IIndustry> =
  mongoose.models.Industry || mongoose.model<IIndustry>("Industry", industrySchema);

export default Industry;