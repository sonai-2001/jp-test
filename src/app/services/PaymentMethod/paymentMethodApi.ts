import axios from 'axios';
import useToast from '@/util/toast';

const url = `${process.env.NEXT_PUBLIC_API_URL}/paymentMethod`;
const { showToast } = useToast();

export const createPaymentMethod = async (body: any) => {
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
      throw new Error("Failed to create payment method. Please try again.");
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

export const getPaymentMethods = async () => {
  try {
    const response: any = await axios.get(url);

    if (!response?.statusText) {
      throw new Error("Failed to fetch payment methods. Please try again.");
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

export const getOnePaymentMethod = async (id: string) => {
  try {
    const response: any = await axios.get(
      `${url}?id=${id}`
    );

    if (!response?.statusText) {
      throw new Error("Failed to fetch payment method. Please try again.");
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

export const updatePaymentMethod = async (body: any) => {
  try {
    const response: any = await axios.patch(
      url,
      body,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response?.statusText) {
      throw new Error("Failed to update payment method. Please try again.");
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

export const deletePaymentMethod = async (id: string) => {
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
      throw new Error("Failed to delete payment method. Please try again.");
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
