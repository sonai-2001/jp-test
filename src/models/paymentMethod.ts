import mongoose, { Schema, Document, Model } from "mongoose";

// Define the interface for the PAYMENT document
export interface PAYMENT extends Document {
    UPI: string;
    NetBanking: string;
}


// Create the schema for the PAYMENT model
const PAYMENTSchema: Schema = new Schema(
    {
        UPI: { type: String, required: true },
        NetBanking: { type: String, required: true },
    },
    { timestamps: true }
);

// Create the model
const PAYMENT: Model<PAYMENT> =
    mongoose.models.PAYMENT || mongoose.model<PAYMENT>("PAYMENT", PAYMENTSchema);

export default PAYMENT;

