import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICatalogue extends Document {
    catalogueName: string;
    catalogueImage: string;
    catalogueImageAlt: string; // NEW: Add alt tag for catalogue image
    catalogueFile: string;
    catalogueDescription: string;
}

const catalogueSchema: Schema = new Schema(
    {
        catalogueName: { type: String },
        catalogueImage: { type: String },
        catalogueImageAlt: { type: String, default: "" }, // NEW: Add alt tag for catalogue image
        catalogueFile: { type: String },
        catalogueDescription: { type: String },
    },
    { timestamps: true }
);

const Catalogue: Model<ICatalogue> =
    mongoose.models.Catalogue ||
    mongoose.model<ICatalogue>("catalogue", catalogueSchema);

export default Catalogue;