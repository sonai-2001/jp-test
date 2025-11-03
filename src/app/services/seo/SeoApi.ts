// /app/services/Seo/SeoApi.ts

import axios from 'axios';
import useToast from '@/util/toast';

const url = `${process.env.NEXT_PUBLIC_API_URL}/seo`;
const { showToast } = useToast();

export interface SeoData {
  slug: string;
  metaTitle?: string;
  metaDescription?: string;
  canonicalUrl?: string;
  robots?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogImageWidth?: number;
  ogImageHeight?: number;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  contentDescription?: string;
  // Add more fields as needed
}

// Get SEO data for a specific slug
export const getSeoBySlug = async (slug: string): Promise<SeoData | null> => {
  try {
    const response = await axios.get(`${url}/${slug}`);
    if (!response?.statusText) {
      throw new Error("Failed to fetch SEO data. Please try again.");
    }
    return response.data as SeoData;
  } catch (error: any) {
    showToast({
      type: "error",
      message: error?.response?.data?.error || "Failed to fetch SEO data.",
    });
    return null;
  }
};

// Create or update SEO data for a slug
export const upsertSeoBySlug = async (slug: string, body: SeoData): Promise<SeoData | null> => {
  try {
    const response = await axios.post(`${url}/${slug}`, body, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response?.statusText) {
      throw new Error("Failed to save SEO data. Please try again.");
    }
    showToast({
      type: "success",
      message: "SEO data saved successfully.",
    });
    return response.data as SeoData;
  } catch (error: any) {
    showToast({
      type: "error",
      message: error?.response?.data?.error || "Failed to save SEO data.",
    });
    return null;
  }
};

// Get all SEO entries (for admin list, optional)
export const getAllSeo = async (): Promise<SeoData[]> => {
  try {
    const response = await axios.get(url);
    if (!response?.statusText) {
      throw new Error("Failed to fetch SEO list. Please try again.");
    }
    return response.data as SeoData[];
  } catch (error: any) {
    showToast({
      type: "error",
      message: error?.response?.data?.error || "Failed to fetch SEO list.",
    });
    return [];
  }
};