import axios from 'axios';
import useToast from '@/util/toast';

const url = `${process.env.NEXT_PUBLIC_API_URL}/dashboard`;
const { showToast } = useToast();

export const getDashboard = async (startDate: string,endDate: string) => {
    try {
        const response: any = await axios.get(`${url}?startDate=${startDate}&endDate=${endDate}`);

        if (!response?.statusText) {
            throw new Error("Failed to fetch Dashboard Details. Please try again.");
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