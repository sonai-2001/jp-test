// @/models/homepage.ts
import mongoose, { Schema, Document, Model } from "mongoose";

export interface IHomePage extends Document {
  overview: {
    image1?: string;
    image1Alt?: string;
    image2?: string;
    image2Alt?: string;
    heading: string;
    subheading: string;
  };
  solutions: string[]; // max 6 items, each max 50 chars
  experienceYears: number;
  productsCount: number;
  satisfiedCustomerCount: number;
  whyJaypeeAssociates: {
    image?: string;
    imageAlt?: string;
    content: string; // max 30 chars
  }[]; // max 6 items
  clientImages: {
    image: string;
    imageAlt?: string;
  }[];
}

const OverviewSchema = new Schema(
  {
    image1: { type: String, default: "" },
    image1Alt: { type: String, default: "" },
    image2: { type: String, default: "" },
    image2Alt: { type: String, default: "" },
    heading: { type: String, default: "" },
    subheading: { type: String, default: "" },
  },
  { _id: false }
);

const WhyJaypeeItemSchema = new Schema(
  {
    image: { type: String, default: "" },
    imageAlt: { type: String, default: "" },
    content: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);

const HomePageSchema = new Schema<IHomePage>(
  {
    overview: { type: OverviewSchema, default: {} },
    solutions: {
      type: [String],
      default: [],
    },
    experienceYears: { type: Number, default: 0 },
    productsCount: { type: Number, default: 0 },
    satisfiedCustomerCount: { type: Number, default: 0 },
    whyJaypeeAssociates: {
      type: [WhyJaypeeItemSchema],
      default: [],
    },
    clientImages: {
      type: [
        {
          image: { type: String, default: "" },
          imageAlt: { type: String, default: "" },
        },
      ],
      default: [],
    },
  },
  { timestamps: true }
);

const HomePage: Model<IHomePage> =
  mongoose.models.HomePage ||
  mongoose.model<IHomePage>("HomePage", HomePageSchema);

export default HomePage;
