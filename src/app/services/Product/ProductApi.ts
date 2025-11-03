import axios from 'axios';
import useToast from '@/util/toast';

const url = `${process.env.NEXT_PUBLIC_API_URL}/product`;
const { showToast } = useToast();

export const createProduct = async (body: any) => {
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
            throw new Error("Failed to create product. Please try again.");
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

export const getProducts = async () => {
    try {
        const response: any = await axios.get(`${url}/getAll`);

        if (!response?.statusText) {
            throw new Error("Failed to fetch products. Please try again.");
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

export const getProductsFilter = async (body: any) => {
    try {
        const response: any = await axios.get(`${url}${body}`);

        if (!response?.statusText) {
            throw new Error("Failed to fetch products. Please try again.");
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

export const getOneProduct = async (id: string) => {
    try {
        const response: any = await axios.get(
            `${url}?id=${id}`
        );

        if (!response?.statusText) {
            throw new Error("Failed to fetch products. Please try again.");
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

export const getOneProductBySlug = async (slug: string) => {
    try {
        const response: any = await axios.get(
            `${url}/${slug}`
        );

        if (!response?.statusText) {
            throw new Error("Failed to fetch products. Please try again.");
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

export const updateProduct = async (body: any) => {
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
            throw new Error("Failed to update product. Please try again.");
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

export const updatedBestsellerApi = async (body: any) => {
    try {
        const response: any = await axios.patch(
            `${url}/updateStatus`,
            body,
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        if (!response?.statusText) {
            throw new Error("Failed to update. Please try again.");
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

export const deleteProduct = async (id: string) => {
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
            throw new Error("Failed to delete product. Please try again.");
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

export const getProductsFilters = async () => {
    try {
        const response: any = await axios.get(`${url}/getFilters`);

        if (!response?.statusText) {
            throw new Error("Failed to fetch products. Please try again.");
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
