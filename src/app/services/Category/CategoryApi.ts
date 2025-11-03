import axios from "axios";
import useToast from "@/util/toast";

const url = `${process.env.NEXT_PUBLIC_API_URL}/category`;
const { showToast } = useToast();

export const createCategory = async (formData: FormData) => {
  try {
    const response: any = await axios.post(url, formData); // axios sets multipart headers
    if (!response?.data?.status) throw new Error("Failed to create category. Please try again.");
    showToast({ type: "success", message: response.data.message });
    return response.data;
  } catch (error: any) {
    const msg =
      error?.response?.data?.error ||
      error?.response?.data?.message ||
      "Failed to create category";
    showToast({ type: "error", message: msg });
    throw new Error(msg);
  }
};

export const updateCategory = async (formData: FormData) => {
  try {
    const response: any = await axios.patch(url, formData);
    if (!response?.data?.status) throw new Error("Failed to update category. Please try again.");
    showToast({ type: "success", message: response.data.message });
    return response.data;
  } catch (error: any) {
    const msg =
      error?.response?.data?.error ||
      error?.response?.data?.message ||
      "Failed to update category";
    showToast({ type: "error", message: msg });
    throw new Error(msg);
  }
};

export const getCategories = async () => {
  try {
    const response: any = await axios.get(url);
    if (!response?.statusText) throw new Error("Failed to fetch categories. Please try again.");
    return response.data;
  } catch (error: any) {
    const msg =
      error?.response?.data?.error ||
      error?.response?.data?.message ||
      "Failed to fetch categories";
    showToast({ type: "error", message: msg });
    throw new Error(msg);
  }
};

export const getOneCategory = async (id: string) => {
  try {
    const response: any = await axios.get(`${url}?id=${id}`);
    if (!response?.statusText) throw new Error("Failed to fetch category. Please try again.");
    return response.data;
  } catch (error: any) {
    const msg =
      error?.response?.data?.error ||
      error?.response?.data?.message ||
      "Failed to fetch category";
    showToast({ type: "error", message: msg });
    throw new Error(msg);
  }
};

export const deleteCategory = async (id: string) => {
  try {
    const response: any = await axios.delete(url, {
      data: { id },
      headers: { "Content-Type": "application/json" },
    });
    if (!response?.statusText) throw new Error("Failed to delete category. Please try again.");
    showToast({ type: "success", message: response.data.message });
    return response.data;
  } catch (error: any) {
    const msg = error?.response?.data?.error || "Failed to delete category";
    showToast({ type: "error", message: msg });
    throw new Error(msg);
  }
};