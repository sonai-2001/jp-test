import axios from 'axios';
import useToast from '@/util/toast';

const url = `${process.env.NEXT_PUBLIC_API_URL}/enquiry`;
const { showToast } = useToast();

export const createEnquiry = async (body: any) => {
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
      throw new Error("Failed to create enquiry. Please try again.");
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


export const getEnquiries = async () => {
  try {
    const response: any = await axios.get(url);

    if (!response?.statusText) {
      throw new Error("Failed to fetch enquiries. Please try again.");
    }

    return await response?.data;
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


export const getIdEnquiries = async (id: string) => {
  try {
    const response: any = await axios.get(`${url}?id=${id}`);

    if (!response?.statusText) {
      throw new Error("Failed to fetch enquiries. Please try again.");
    }

    return await response?.data;
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

export const getproductUserIdEnquiries = async (id: string) => {
  try {
    const response: any = await axios.get(`${url}?productUserId=${id}`);

    if (!response?.statusText) {
      throw new Error("Failed to fetch enquiries. Please try again.");
    }

    return response.data;
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

export const getproductIdEnquiries = async (id: string) => {
  try {
    const response: any = await axios.get(`${url}?productId=${id}`);

    if (!response?.statusText) {
      throw new Error("Failed to fetch enquiries. Please try again.");
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

export const getEnquiryById = async (id: string) => {
  try {
    const response: any = await axios.get(
      `${url}?id=${id}`
    );

    if (!response?.statusText) {
      throw new Error("Failed to fetch enquiry. Please try again.");
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

export const updateEnquiry = async (id: string, body: any) => {
  try {
    const response: any = await axios.patch(
      url,
      { id, ...body },
      {
        headers: {
          "Content-Type": "application/json",
        },
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


export const updateEnquiryEstimatedTime = async (body: any) => {
  try {
    const response: any = await axios.patch(
      `${url}/updateEstimatedTime`,
      body,
      {
        headers: {
          "Content-Type": "application/json",
        },
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


export const invoiceSend = async (body: any) => {
  try {
    const response: any = await axios.patch(
      `${url}/sendInvoice`,
      body,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
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


export const updateEnquirySlip = async (body: any) => {
  try {
    const response: any = await axios.patch(
      `${url}/submitSlip`,
      body,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
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

export const enquiryQuotation = async (id: string, body: any) => {
  try {
    const response: any = await axios.patch(
      // `http://localhost:3000/api/enquiry/enquiryQuotation`,
      `${url}/enquiryQuotation`,
      { id, ...body },
      {
        headers: {
          "Content-Type": "application/json",
        },
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

export const changeEnquiryStatus = async (id: string, userId: string, productId: string, status: string) => {
  try {
    const response: any = await axios.patch(
      url,
      { id, userId, productId, status },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response?.statusText) {
      throw new Error("Failed to change enquiry status. Please try again.");
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

export const deleteEnquiry = async (id: string) => {
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
      throw new Error("Failed to delete enquiry. Please try again.");
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