import axios from "axios";
import useToast from "@/util/toast";

const url = `${process.env.NEXT_PUBLIC_API_URL}/industry`;
const { showToast } = useToast();

export const createIndustry = async (formData: FormData) => {
  try {
    const response: any = await axios.post(url, formData); // let axios set multipart headers
    if (!response?.data?.status) throw new Error("Failed to create industry. Please try again.");
    showToast({ type: "success", message: response.data.message });
    return response.data;
  } catch (error: any) {
    const msg =
      error?.response?.data?.error ||
      error?.response?.data?.message ||
      "Failed to create industry";
    showToast({ type: "error", message: msg });
    throw new Error(msg);
  }
};

export const updateIndustry = async (formData: FormData) => {
  try {
    const response: any = await axios.patch(url, formData);
    if (!response?.data?.status) throw new Error("Failed to update industry.");
    showToast({ type: "success", message: response.data.message });
    return response.data;
  } catch (error: any) {
    const msg =
      error?.response?.data?.error ||
      error?.response?.data?.message ||
      "Failed to update industry";
    showToast({ type: "error", message: msg });
    throw new Error(msg);
  }
};

export const getIndustries = async () => {
  try {
    const response: any = await axios.get(url);
    if (!response?.statusText) throw new Error("Failed to fetch industries.");
    return response.data;
  } catch (error: any) {
    const msg =
      error?.response?.data?.error ||
      error?.response?.data?.message ||
      "Failed to fetch industries";
    showToast({ type: "error", message: msg });
    throw new Error(msg);
  }
};

export const getOneIndustry = async (id: string) => {
  try {
    const response: any = await axios.get(`${url}?id=${id}`);
    if (!response?.statusText) throw new Error("Failed to fetch industry.");
    return response.data;
  } catch (error: any) {
    const msg =
      error?.response?.data?.error ||
      error?.response?.data?.message ||
      "Failed to fetch industry";
    showToast({ type: "error", message: msg });
    throw new Error(msg);
  }
};

export const deleteIndustry = async (id: string) => {
  try {
    const response: any = await axios.delete(url, {
      data: { id },
      headers: { "Content-Type": "application/json" },
    });
    if (!response?.statusText) throw new Error("Failed to delete industry.");
    showToast({ type: "success", message: response.data.message });
    return response.data;
  } catch (error: any) {
    const msg =
      error?.response?.data?.error ||
      error?.response?.data?.message ||
      "Failed to delete industry";
    showToast({ type: "error", message: msg });
    throw new Error(msg);
  }
};