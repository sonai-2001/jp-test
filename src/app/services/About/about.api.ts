import useToast from "@/util/toast";
import axios from "axios";
const { showToast } = useToast();
const url = `${process.env.NEXT_PUBLIC_API_URL}/about`;

// ✅ Fetch About Page Data
export const getAbout = async () => {
  try {
    const response = await axios.get(url);

    if (!response?.statusText) {
      throw new Error("Failed to fetch About page details. Please try again.");
    }

    return response.data;
  } catch (error: any) {
    console.error("Error fetching About data:", error);

    showToast({
      type: "error",
      message:
        error?.response?.data?.message ||
        "Unable to load About page. Please try again later.",
    });

    throw new Error(error?.response?.data?.error || "Failed to get About page");
  }
};

// ✅ Create or Update About Page
export const saveAbout = async (formData: FormData) => {
  try {
    const response: any = await axios.post(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (!response?.statusText) {
      throw new Error("Failed to save About page. Please try again.");
    }

    showToast({
      type: "success",
      message: response?.data?.message || "About page saved successfully!",
    });

    return response.data;
  } catch (error: any) {
    console.error("Error saving About page:", error);

    showToast({
      type: "error",
      message:
        error?.response?.data?.message ||
        "Failed to save About page. Please try again later.",
    });

    throw new Error(error?.response?.data?.error || "Save operation failed");
  }
};
