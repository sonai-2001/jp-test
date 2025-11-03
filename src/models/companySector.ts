import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICompanySector extends Document {
  companySector: string;
}

const companySectorSchema: Schema = new Schema(
  {
    companySector: { type: String, unique: true },
  },
  { timestamps: true }
);

const CompanySector: Model<ICompanySector> =
  mongoose.models.CompanySector ||
  mongoose.model<ICompanySector>("CompanySector", companySectorSchema);

export default CompanySector;
