import axios from 'axios';
import useToast from '@/util/toast';

const url = `${process.env.NEXT_PUBLIC_API_URL}/faq`;
const { showToast } = useToast();

export const createFAQ = async (body: any) => {
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
            throw new Error("Failed to create FAQ. Please try again.");
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

export const getFAQs = async () => {
    try {
        const response: any = await axios.get(url);

        if (!response?.statusText) {
            throw new Error("Failed to fetch FAQs. Please try again.");
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

export const getOneFAQ = async (id: string) => {
    try {
        const response: any = await axios.get(
            `${url}?id=${id}`
        );

        if (!response?.statusText) {
            throw new Error("Failed to fetch FAQ. Please try again.");
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

export const updateFAQ = async (id: string, body: any) => {
    try {
        const response: any = await axios.patch(
            url,
            { id, ...body },
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        if (!response?.statusText) {
            throw new Error("Failed to update FAQ. Please try again.");
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

export const deleteFAQ = async (id: string) => {
    try {
        const response: any = await axios.delete(
            url,
            {
                data: { id },
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        if (!response?.statusText) {
            throw new Error("Failed to delete FAQ. Please try again.");
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
