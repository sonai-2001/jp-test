import axios from "axios";
import useToast from "@/util/toast";

const url = `${process.env.NEXT_PUBLIC_API_URL}/testimonial`;
const { showToast } = useToast();

export const createTestimonial = async (body: any) => {
  try {
    const res: any = await axios.post(url, body, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    if (!res?.statusText) throw new Error("Failed to create testimonial.");
    showToast({ type: "success", message: res.data.message || "Created" });
    return res.data;
  } catch (err: any) {
    showToast({ type: "error", message: err?.response?.data?.error || "Error" });
    throw err;
  }
};

export const getTestimonials = async (query = "") => {
  try {
    const res: any = await axios.get(`${url}/getAll${query}`);
    if (!res?.statusText) throw new Error("Failed to fetch testimonials.");
    return res.data;
  } catch (err: any) {
    showToast({ type: "error", message: err?.response?.data?.error || "Error" });
    throw err;
  }
};

export const getOneTestimonial = async (id: string) => {
  try {
    const res: any = await axios.get(`${url}?id=${id}`);
    if (!res?.statusText) throw new Error("Failed to fetch testimonial.");
    return res.data;
  } catch (err: any) {
    showToast({ type: "error", message: err?.response?.data?.error || "Error" });
    throw err;
  }
};

export const updateTestimonial = async (body: any) => {
  try {
    const res: any = await axios.patch(url, body, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    if (!res?.statusText) throw new Error("Failed to update testimonial.");
    showToast({ type: "success", message: res.data.message || "Updated" });
    return res.data;
  } catch (err: any) {
    showToast({ type: "error", message: err?.response?.data?.error || "Error" });
    throw err;
  }
};

export const deleteTestimonial = async (id: string) => {
  try {
    const res: any = await axios.delete(url, {
      data: { id },
      headers: { "Content-Type": "application/json" },
    });
    if (!res?.statusText) throw new Error("Failed to delete testimonial.");
    showToast({ type: "success", message: res.data.message || "Deleted" });
    return res.data;
  } catch (err: any) {
    showToast({ type: "error", message: err?.response?.data?.error || "Error" });
    throw err;
  }
};