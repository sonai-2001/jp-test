import axios from 'axios';
import useToast from '@/util/toast';

const url = `${process.env.NEXT_PUBLIC_API_URL}/brand`;
const { showToast } = useToast();

export const createBrand = async (body: any) => {

    try {
        const response: any = await axios.post(
            url,
            body,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );

        if (!response?.statusText) {
            throw new Error("Failed to create brand. Please try again.");
        } else {
            showToast({
                type: "success", message: response.data.message
            });
        }
        return await response.data;
    } catch (error: any) {
        if (error) {
            showToast({
                type: "error", message: error.response.data.message
            });

            throw new Error(error.response.data.error);
        }
        return error;
    }
};

export const getBrands = async () => {
    try {
        const response: any = await axios.get(url);

        if (!response?.statusText) {
            throw new Error("Failed to fetch brands. Please try again.");
        }
        return await response.data;
    } catch (error: any) {
        if (error) {
            showToast({
                type: "error", message: error.response.data.error?error.response.data.error:error.response.data.message
            });
            throw new Error(error.response.data.error);
        }
        return error;
    }
};

export const getOneBrand = async (id: string) => {
    try {
        const response: any = await axios.get(
            `${url}?id=${id}`
        );

        if (!response?.statusText) {
            throw new Error("Failed to fetch brand. Please try again.");
        }

        return await response.data;
    } catch (error: any) {
        if (error) {
            showToast({
                type: "error", message: error.response.data.message ? error.response.data.message: error.response.data.error
            });
            throw new Error(error.response.data.error);
        }
        return error;
    }
};

export const updateBrand = async (body: any) => {
    try {
        const response: any = await axios.patch(
            url,
            body,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );

        if (!response?.statusText) {
            throw new Error("Failed to update brand. Please try again.");
        } else {
            showToast({
                type: "success", message: response.data.message
            });
        }
        return await response.data;
    } catch (error: any) {
        if (error) {
            showToast({
                type: "error", message: error.response.data.message ? error.response.data.message: error.response.data.error
            });
            throw new Error(error.response.data.error);
        }
        return error;
    }
};

export const deleteBrand = async (id: string) => {

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
            throw new Error("Failed to delete brand. Please try again.");
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
