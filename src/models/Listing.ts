// models/Listing.ts
import mongoose, { Schema, Document, Model } from "mongoose";

export interface IListing extends Document {
  userName: string;
  email: string;
  companies: string[];
}

const ListingSchema: Schema = new Schema({
  userName: { type: String, required: true },
  email: { type: String, required: true },
  companies: { type: [String], required: true },
});

const Listing: Model<IListing> =
  mongoose.models.Listing || mongoose.model<IListing>("Listing", ListingSchema);

export default Listing;
