import mongoose, { Schema, Document, Model } from "mongoose";
import bcrypt from "bcrypt";

// Define the interface for the User document
export interface IUser extends Document {
  userName: string;
  password: string;
  email: string;
}

// Create the schema for the User model
const UserSchema: Schema = new Schema({
  userName: { type: String, required: true, unique: true },
  email: { type: String, unique: true },
  password: { type: String, trim: true },
},
{ timestamps: true });
UserSchema.pre<IUser>("save", async function (next: Function) {
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
const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;
