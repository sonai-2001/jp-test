import axios from 'axios';
import useToast from '@/util/toast';

const url = `${process.env.NEXT_PUBLIC_API_URL}/manageEmails`;
const { showToast } = useToast();

export const createManageEmails = async (body: any) => {
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
            throw new Error("Failed to create Manage Email. Please try again.");
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

export const getManageEmails = async () => {
    try {
        const response: any = await axios.get(url);

        if (!response?.statusText) {
            throw new Error("Failed to fetch Manage Emails. Please try again.");
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

export const getOneManageEmails = async (id: string) => {
    try {
        const response: any = await axios.get(
            `${url}?id=${id}`
        );

        if (!response?.statusText) {
            throw new Error("Failed to fetch Manage Emails. Please try again.");
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

export const updateManageEmails = async (id: string, body: any) => {
    try {
        const response: any = await axios.patch(
            `${url}`,
            { ...body, id },
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        if (!response?.statusText) {
            throw new Error("Failed to update Manage Email. Please try again.");
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

export const deleteManageEmails = async (id: string) => {
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
            throw new Error("Failed to delete Manage Email. Please try again.");
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
