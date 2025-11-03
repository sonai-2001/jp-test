// models/ManageEmail.ts
import mongoose, { Schema, Document, Model } from "mongoose";

export interface ManageEmail extends Document {
    primaryEmail: string;
    secondaryEmail: string;
}

const ManageEmailSchema: Schema = new Schema({
    primaryEmail: { type: String, required: true, default: "" },
    secondaryEmail: { type: String, required: true, default: "" },
});

const ManageEmail: Model<ManageEmail> =
    mongoose.models.ManageEmail || mongoose.model<ManageEmail>("ManageEmail", ManageEmailSchema);

export default ManageEmail;
