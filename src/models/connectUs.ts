import mongoose, { Schema, Document, Model } from "mongoose";

// Define the interface for the ConnectUs document
export interface IConnectUs extends Document {
    name: string;
    email: string;
    phone: string;
    message: string;
    status: boolean;
}

// Create the schema for the ConnectUs model
const ConnectUsSchema: Schema = new Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String, required: true },
        message: { type: String, required: true },
        status: { type: Boolean, default: false },
    },
    { timestamps: true }
);

// Create the model
const ConnectUs: Model<IConnectUs> =
    mongoose.models.ConnectUs || mongoose.model<IConnectUs>("ConnectUs", ConnectUsSchema);

export default ConnectUs;
