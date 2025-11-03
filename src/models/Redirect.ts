// models/Redirect.ts
import { Schema, model, models, InferSchemaType, Model } from 'mongoose';

const RedirectSchema = new Schema({
  from: { type: String, required: true, unique: true }, // old slug
  to:   { type: String, required: true },               // new slug
  type: { type: String, default: '301' },               // redirect type
  updatedAt: { type: Date, default: Date.now },
});

export type RedirectDoc = InferSchemaType<typeof RedirectSchema>; // { from, to, type?, updatedAt? }

const RedirectModel: Model<RedirectDoc> =
  (models.Redirect as Model<RedirectDoc>) || model<RedirectDoc>('Redirect', RedirectSchema);

export default RedirectModel;