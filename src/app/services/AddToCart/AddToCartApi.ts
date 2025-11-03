import axios from 'axios';
import useToast from '@/util/toast';

const url = `${process.env.NEXT_PUBLIC_API_URL}/addToCart`;
const { showToast } = useToast();


export const createCartItem = async (body: any) => {
    try {
        const response: any = await axios.post(url, body, {
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response?.statusText) {
            throw new Error("Failed to create cart item. Please try again.");
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

export const getCartItems = async (userId?: string) => {
    try {
        const response: any = await axios.get(userId ? `${url}?userId=${userId}` : url);

        if (!response?.statusText) {
            throw new Error("Failed to fetch cart items. Please try again.");
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

export const getOneCartItem = async (id: string) => {
    try {
        const response: any = await axios.get(`${url}?id=${id}`);

        if (!response?.statusText) {
            throw new Error("Failed to fetch cart item. Please try again.");
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

export const updateCartItem = async (body: any) => {
    try {
        const response: any = await axios.patch(url, body, {
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response?.statusText) {
            throw new Error("Failed to update cart item. Please try again.");
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

export const deleteCartItem = async (id: string) => {
    try {
        const response: any = await axios.delete(url, {
            data: { id },
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response?.statusText) {
            throw new Error("Failed to delete cart item. Please try again.");
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
