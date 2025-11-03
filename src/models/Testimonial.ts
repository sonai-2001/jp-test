import mongoose, { Schema, Document, Model } from "mongoose";

export interface ITestimonial extends Document {
  name: string;
  company: string;
  content: string;
  avatar: string; // S3 URL
  rating: number; // 1-5
}

const TestimonialSchema: Schema<ITestimonial> = new Schema(
  {
    name: { type: String, required: true, trim: true },
    company: { type: String, required: true, trim: true },
    content: { type: String, required: true, trim: true },
    avatar: { type: String, default: "" },
    rating: { type: Number, min: 1, max: 5, default: 5 },
  },
  { timestamps: true }
);

// Simple index for listing newest first
TestimonialSchema.index({ createdAt: -1 });

const Testimonial: Model<ITestimonial> =
  mongoose.models.Testimonial || mongoose.model<ITestimonial>("Testimonial", TestimonialSchema);

export default Testimonial;