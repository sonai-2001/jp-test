import mongoose, { Schema, Document, Model } from "mongoose";

export interface IMedia extends Document {
    images: string[];
}

const MediaSchema: Schema = new Schema(
    {
        images: { type: [String], required: true },
    },
    { timestamps: true }
);

const Media: Model<IMedia> =
    mongoose.models.Media ||
    mongoose.model<IMedia>("Media", MediaSchema);

export default Media;
