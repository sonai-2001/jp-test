import axios from 'axios';
import useToast from '@/util/toast';

const url = `${process.env.NEXT_PUBLIC_API_URL}/connectUs`;
const { showToast } = useToast();

export const createConnectUs = async (body: any) => {
    try {
        const response: any = await axios.post(
            url,
            body,
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        if (!response?.statusText) {
            throw new Error("Failed to send message. Please try again.");
        } else {
            showToast({
                type: "success", message: response.data.message
            });
        }
        return await response.data;
    } catch (error: any) {
        if (error) {
            showToast({
                type: "error", message: error.response.data.error
            });
            throw new Error(error.response.data.error);
        }
        return error;
    }
};

export const getConnectUsById = async (id: string) => {
    try {
        const response: any = await axios.get(`${url}/?id=${id}`);

        if (!response?.data) {
            throw new Error("No data found for the provided ID.");
        }

        return response.data;
    } catch (error: any) {
        showToast({
            type: "error",
            message: error?.response?.data?.error || "Failed to fetch data.",
        });
        throw new Error(error?.response?.data?.error || "Fetch failed");
    }
};

export const getConnectUsList = async () => {
    try {
        const response: any = await axios.get(url);

        return response.data;
    } catch (error: any) {
        showToast({
            type: "error",
            message: error?.response?.data?.error || "Failed to fetch list.",
        });
        throw new Error(error?.response?.data?.error || "List fetch failed");
    }
};

export const deleteConnectUs = async (id: string) => {
    try {
        const response: any = await axios.delete(`${url}/${id}`);

        showToast({
            type: "success",
            message: response.data.message || "Deleted successfully",
        });

        return response.data;
    } catch (error: any) {
        showToast({
            type: "error",
            message: error?.response?.data?.error || "Failed to delete.",
        });
        throw new Error(error?.response?.data?.error || "Delete failed");
    }
};
