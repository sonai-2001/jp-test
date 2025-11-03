const url = `${process.env.NEXT_PUBLIC_API_URL}/productUser`;
import useToast from '@/util/toast';
import axios from 'axios';

const { showToast } = useToast();

export const UserRegister = async (body: any) => {

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
            throw new Error("Failed to fetch user data. Please try again.");
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
}

export const userLogin = async (body: any) => {

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
            throw new Error("Failed to fetch user data. Please try again.");
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
}

export const userUpdate = async (body: any) => {

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
            throw new Error("Failed to fetch user data. Please try again.");
        } else {
            showToast({
                type: "success", message: response.data.message
            });
        }
        return await response.data?.data;
    } catch (error: any) {

        if (error) {
            showToast({
                type: "error", message: error.response.data.error
            });
            throw new Error(error.response.data.error);
        }
        return error;
    }
}

export const getOneUser = async (id: string) => {
    try {
        const response: any = await axios.get(
            `${url}?id=${id}`
        );

        if (!response?.statusText) {
            throw new Error("Failed to fetch user. Please try again.");
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

export const getUsers = async () => {
    try {
        const response: any = await axios.get(url);

        if (!response?.statusText) {
            throw new Error("Failed to fetch users. Please try again.");
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

export const deleteUser = async (id: string) => {
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
            throw new Error("Failed to delete user. Please try again.");
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

export const forgotPassword = async (email: string) => {
    try {
        const response: any = await axios.post(
            `${url}/forgotPassword`,
            { email },
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        if (!response?.statusText) {
            throw new Error("Failed to send password recovery link. Please try again.");
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

export const resetPassword = async (id: string, token: string, newPassword: string, confirmPassword: string) => {
    try {
        const response: any = await axios.post(
            `${url}/forgotPassword`,
            { id, token, newPassword, confirmPassword },
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        if (!response?.statusText) {
            throw new Error("Failed to reset password. Please try again.");
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

export const ChangePasswordApi = async (id: string, oldPassword: string, newPassword: string, confirmPassword: string) => {
    try {
        const response: any = await axios.post(
            `${url}/changePassword`,
            { id, oldPassword, newPassword, confirmPassword },
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        if (!response?.statusText) {
            throw new Error("Failed to change password. Please try again.");
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

