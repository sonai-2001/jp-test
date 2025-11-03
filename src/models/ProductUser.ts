// src\models\ProductUser.ts
import mongoose, { Schema, Document, Model } from "mongoose";
import bcrypt from "bcrypt";

// Define the interface for the ProductUser document
export interface IProductUser extends Document {
  name: string;
  email: string;
  password: string;
  image: string;
  companyName: string;
  mobile: string;
  address: string;
  gstNumber: string;
  sameAsAddress: boolean;
  type: string;
  deliveryAddress: string;
  isVerified: Boolean;
}

// Create the schema for the ProductUser model
const ProductUserSchema: Schema = new Schema({
  name: { type: String },
  email: { type: String, unique: true, required: true },
  password: { type: String, select: false },
  image: { type: String },
  companyName: { type: String },
  mobile: { type: String },
  isVerified: {type: Boolean, default:false},
  address: { type: String },
  gstNumber: { type: String },
  type: { type: String, default: "user" },
  sameAsAddress: {},
  deliveryAddress: { type: String }
},
{ timestamps: true });

ProductUserSchema.pre<IProductUser>("save", async function (next: Function) {
  const user = this;
  if (!user.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Create the model
const ProductUser: Model<IProductUser> =
  mongoose.models.ProductUser || mongoose.model<IProductUser>("ProductUser", ProductUserSchema);

export default ProductUser;
