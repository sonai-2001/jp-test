import mongoose, { Schema, Document, Model } from "mongoose";

export interface IContact extends Document {
  contact_numbers: string[];
  emailIds: string[];
  website: string;
  address: string;
  location: string;
}

const ContactSchema: Schema = new Schema(
  {
    contact_numbers: { type: [String], default: [] },
    emailIds: { type: [String], default: [] },
    website: { type: String, default: "" },
    address: { type: String, default: "" },
    location: { type: String, default: "" },
  },
  { timestamps: true }
);

const Contact: Model<IContact> =
  mongoose.models.Contact || mongoose.model<IContact>("Contact", ContactSchema);

export default Contact;
