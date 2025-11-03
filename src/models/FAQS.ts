import mongoose, { Schema, Document, Model } from "mongoose";

// Define the interface for the FAQ document
export interface IFAQ extends Document {
  question: string;
  answer: string;
}

// Create the schema for the FAQ model
const FAQSchema: Schema = new Schema(
  {
    question: { type: String, required: true },
    answer: { type: String, required: true },
  },
  { timestamps: true }
);

// Create the model
const FAQ: Model<IFAQ> =
  mongoose.models.FAQ || mongoose.model<IFAQ>("FAQ", FAQSchema);

export default FAQ;
