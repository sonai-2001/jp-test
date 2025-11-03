import mongoose, { Schema, Document, Model } from "mongoose";

// Define the interface for the INVOICE document
export interface IINVOICE extends Document {
    invoiceNumber: string;
    email: string;
    phone: string;
    address: string;
    companyName: string;
    GSTIN: string;
    CODE: string;
    PAN: string;
    website: string;
    signatory: string;
    bName: string;
    bAddress: string;
    bCity: string;
    bPinCode: string;
    bIFSCode: string;
    bAccountNo: string;
}





// Create the schema for the INVOICE model
const INVOICESchema: Schema = new Schema(
    {
        invoiceNumber: { type: String},
        email: { type: String, required: true },
        phone: { type: String, required: true },
        address: { type: String, required: true },
        companyName: { type: String, required: true },
        GSTIN: { type: String, required: true },
        CODE: { type: String, required: true },
        PAN: { type: String, required: true },
        website: { type: String, required: true },
        signatory: { type: String, required: true },
        bName: { type: String, required: true },
        bAddress: { type: String, required: true },
        bCity: { type: String, required: true },
        bPinCode: { type: String, required: true },
        bIFSCode: { type: String, required: true },
        bAccountNo: { type: String, required: true },
    },
    { timestamps: true }
);

// Create the model
const INVOICE: Model<IINVOICE> =
    mongoose.models.INVOICE || mongoose.model<IINVOICE>("INVOICE", INVOICESchema);

export default INVOICE;

