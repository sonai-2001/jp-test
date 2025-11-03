import axios from 'axios';
import useToast from '@/util/toast';

const url = `${process.env.NEXT_PUBLIC_API_URL}/uploadeProducts`;
const { showToast } = useToast();

export const uploadeProduct = async (body: any) => {
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
      throw new Error("Failed to upload CSV file. Please try again.");
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
      error.response.data.message && 
      showToast({
        type: "error", message: error.response.data.error
      });
      throw new Error(error.response.data.error);
    }
    return error;
  }
};
