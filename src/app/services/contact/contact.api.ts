// @/app/services/Contact/contact.api.ts
import useToast from "@/util/toast";
import axios from "axios";
const { showToast } = useToast();
const url = `${process.env.NEXT_PUBLIC_API_URL}/contact`;

// ✅ Fetch Contact Data
export const getContact = async () => {
  try {
    const response = await axios.get(url);

    if (!response?.status) {
      throw new Error("Failed to fetch contact details. Please try again.");
    }

    return response.data;
  } catch (error: any) {
    console.error("Error fetching contact data:", error);

    showToast({
      type: "error",
      message:
        error?.response?.data?.message ||
        "Unable to load contact information. Please try again later.",
    });

    throw new Error(
      error?.response?.data?.error || "Failed to get contact information"
    );
  }
};

// ✅ Create or Update Contact Information
export const saveContact = async (formData: any) => {
  try {
    const response: any = await axios.post(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (!response?.status) {
      throw new Error("Failed to save contact information. Please try again.");
    }

    showToast({
      type: "success",
      message:
        response?.data?.message || "Contact information saved successfully!",
    });

    return response.data;
  } catch (error: any) {
    console.error("Error saving contact information:", error);

    showToast({
      type: "error",
      message:
        error?.response?.data?.message ||
        "Failed to save contact information. Please try again later.",
    });

    throw new Error(error?.response?.data?.error || "Save operation failed");
  }
};
