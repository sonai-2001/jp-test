import axios from 'axios';
import useToast from '@/util/toast';

const url = `${process.env.NEXT_PUBLIC_API_URL}/invoice`;
const { showToast } = useToast();

export const createInvoice = async (body: any) => {
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
      throw new Error("Failed to create invoice. Please try again.");
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

export const getInvoices = async () => {
  try {
    const response: any = await axios.get(url);

    if (!response?.statusText) {
      throw new Error("Failed to fetch invoices. Please try again.");
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

export const getOneInvoice = async (id: string) => {
  try {
    const response: any = await axios.get(
      `${url}?id=${id}`
    );

    if (!response?.statusText) {
      throw new Error("Failed to fetch invoice. Please try again.");
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

export const updateInvoice = async (body: any) => {
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
      throw new Error("Failed to update invoice. Please try again.");
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

export const updateInvoiceNo = async (body: any) => {
  try {
    const response: any = await axios.patch(
      `${url}/updateNumber`,
      {...body },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response?.statusText) {
      throw new Error("Failed to update invoice number. Please try again.");
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


export const deleteInvoice = async (id: string) => {
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
      throw new Error("Failed to delete invoice. Please try again.");
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
