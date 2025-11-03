import useToast from "@/util/toast";
import axios from "axios";

const { showToast } = useToast();
const url = `${process.env.NEXT_PUBLIC_API_URL}/home`;

// ✅ Fetch Home Page Data
export const getHomePage = async () => {
  try {
    const response = await axios.get(url);

    if (!response?.statusText) {
      throw new Error("Failed to fetch Home page details. Please try again.");
    }

    return response.data;
  } catch (error: any) {
    console.error("Error fetching Home data:", error);

    showToast({
      type: "error",
      message:
        error?.response?.data?.message ||
        "Unable to load Home page. Please try again later.",
    });

    throw new Error(error?.response?.data?.error || "Failed to get Home page");
  }
};

// ✅ Create or Update Home Page
export const saveHomePage = async (formData: FormData) => {
  try {
    const response: any = await axios.post(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (!response?.statusText) {
      throw new Error("Failed to save Home page. Please try again.");
    }

    showToast({
      type: "success",
      message: response?.data?.message || "Home page saved successfully!",
    });

    return response.data;
  } catch (error: any) {
    console.error("Error saving Home page:", error);

    showToast({
      type: "error",
      message:
        error?.response?.data?.message ||
        "Failed to save Home page. Please try again later.",
    });

    throw new Error(error?.response?.data?.error || "Save operation failed");
  }
};
