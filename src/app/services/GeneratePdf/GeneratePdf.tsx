import axios from 'axios';
import useToast from '@/util/toast';

const url = `${process.env.NEXT_PUBLIC_API_URL}`;
const { showToast } = useToast();

export const generatePdf = async (htmlContent: any) => {
    try {
        const response = await axios.post(
                `${url}/generatePdf`,
                { htmlContent },
                {
                    headers: { 'Content-Type': 'application/json' },
                    responseType: 'blob', // important for binary file download
                }
            );

        if (!response?.statusText) {
            throw new Error("Failed to update enquiry. Please try again.");
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

