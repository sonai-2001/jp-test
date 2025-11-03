import mongoose, { Schema, Document, Model } from "mongoose";

export interface IAboutPage extends Document {
  story: {
    content: string;
    image?: string;
    altTag?: string; // NEW

  };
  mission: {
    content: string;
    image?: string;
    altTag?: string; // NEW

  };
  vision: {
    content: string;
    image?: string;
        altTag?: string; // NEW

  };
  approach: {
    heading: string;
    subheading: string;
    image?: string;
        altTag?: string; // NEW

  }[];
  whyChooseUs: string; // HTML or plain text from editor
  coreValues: {
    heading: string;
    image?: string;
        altTag?: string; // NEW

  }[];
}

const ImageContentSchema = new Schema(
  {
    content: { type: String, default: "" },
    image: { type: String, default: "" },
        altTag: { type: String, default: "" }, // NEW

  },
  { _id: false }
);

const ApproachItemSchema = new Schema(
  {
    heading: { type: String, required: true },
    subheading: { type: String, default: "" },
    image: { type: String, default: "" },
        altTag: { type: String, default: "" }, // NEW

  },
  { _id: false }
);

const CoreValueItemSchema = new Schema(
  {
    heading: { type: String, required: true },
    image: { type: String, default: "" },
        altTag: { type: String, default: "" }, // NEW

  },
  { _id: false }
);

const AboutPageSchema = new Schema<IAboutPage>(
  {
    story: { type: ImageContentSchema, default: {} },
    mission: { type: ImageContentSchema, default: {} },
    vision: { type: ImageContentSchema, default: {} },
    approach: { type: [ApproachItemSchema], default: [] },
    whyChooseUs: { type: String, default: "" },
    coreValues: { type: [CoreValueItemSchema], default: [] },
  },
  { timestamps: true }
);

const AboutPage: Model<IAboutPage> =
  mongoose.models.AboutPage || mongoose.model<IAboutPage>("AboutPage", AboutPageSchema);

export default AboutPage;
