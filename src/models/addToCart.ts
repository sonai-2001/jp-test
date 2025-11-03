import mongoose, { Schema, Document, Model } from "mongoose";

export interface IAddToCart extends Document {
    index: number;
    quantity: number;
    productName: string;
    productImage: string;
    userId: string;
    productId: string;
    hsn: string;
    productModel: {
        modelName: string;
        basePrice: string;
    };
}

const AddToCartSchema: Schema = new Schema(
    {
        index: { type: Number, required: true },
        quantity: { type: Number, required: true },
        productName: { type: String, required: true },
        productImage: { type: String, required: true },
        userId: { type: String, required: true },
        productId: { type: String, required: true },
        hsn: { type: String, required: true },
        productModel: {
            modelName: { type: String, required: true },
            basePrice: { type: String, required: true },
        },
    },
    { timestamps: true }
);

const AddToCart: Model<IAddToCart> =
    mongoose.models.AddToCart ||
    mongoose.model<IAddToCart>("AddToCart", AddToCartSchema);

export default AddToCart;
