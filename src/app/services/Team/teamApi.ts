// @/app/services/Team/TeamApi.ts
import axios from "axios";
import useToast from "@/util/toast";

const url = `${process.env.NEXT_PUBLIC_API_URL}/team`;
const { showToast } = useToast();

export const createTeamMember = async (body: any) => {
  try {
    const res: any = await axios.post(url, body, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    if (!res?.statusText) throw new Error("Failed to create team member.");
    showToast({ type: "success", message: res.data.message || "Created" });
    return res.data;
  } catch (err: any) {
    showToast({
      type: "error",
      message: err?.response?.data?.error || "Error",
    });
    throw err;
  }
};

export const getTeamMembers = async (query = "") => {
  try {
    const res: any = await axios.get(`${url}/getAll${query}`);
    if (!res?.statusText) throw new Error("Failed to fetch team members.");
    return res.data;
  } catch (err: any) {
    showToast({
      type: "error",
      message: err?.response?.data?.error || "Error",
    });
    throw err;
  }
};

export const getOneTeamMember = async (id: string) => {
  try {
    const res: any = await axios.get(`${url}?id=${id}`);
    if (!res?.statusText) throw new Error("Failed to fetch team member.");
    return res.data;
  } catch (err: any) {
    showToast({
      type: "error",
      message: err?.response?.data?.error || "Error",
    });
    throw err;
  }
};

export const updateTeamMember = async (body: any) => {
  try {
    const res: any = await axios.patch(url, body, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    if (!res?.statusText) throw new Error("Failed to update team member.");
    showToast({ type: "success", message: res.data.message || "Updated" });
    return res.data;
  } catch (err: any) {
    showToast({
      type: "error",
      message: err?.response?.data?.error || "Error",
    });
    throw err;
  }
};

export const deleteTeamMember = async (id: string) => {
  try {
    const res: any = await axios.delete(url, {
      data: { id },
      headers: { "Content-Type": "application/json" },
    });
    if (!res?.statusText) throw new Error("Failed to delete team member.");
    showToast({ type: "success", message: res.data.message || "Deleted" });
    return res.data;
  } catch (err: any) {
    showToast({
      type: "error",
      message: err?.response?.data?.error || "Error",
    });
    throw err;
  }
};
