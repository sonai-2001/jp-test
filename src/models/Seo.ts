// /models/Seo.ts
import mongoose from 'mongoose';

const SeoSchema = new mongoose.Schema({
  pageType: String, // 'static' or 'product'
  slug: { type: String, required: true, unique: true },
  metaTitle: String,
  metaDescription: String,
  canonicalUrl: String,
  robots: String,
  ogTitle: String,
  ogDescription: String,
  ogImage: String,
  ogImageWidth: Number,
  ogImageHeight: Number,
  twitterTitle: String,
  twitterDescription: String,
  twitterImage: String,
  contentTitle: String,           // NEW
  contentDescription: String, 
}, { timestamps: true });

export default mongoose.models.Seo || mongoose.model('Seo', SeoSchema);