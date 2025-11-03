import axios from 'axios';
import useToast from '@/util/toast';

const url = `${process.env.NEXT_PUBLIC_API_URL}/media`;
const { showToast } = useToast();

export const createMedia = async (body: any) => {
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
      throw new Error("Failed to upload images. Please try again.");
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

export const getMedia = async () => {
  try {
    const response: any = await axios.get(url);

    if (!response?.statusText) {
      throw new Error("Failed to fetch images. Please try again.");
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

export const getOneMedia = async (id: string) => {
  try {
    const response: any = await axios.get(
      `${url}?id=${id}`
    );

    if (!response?.statusText) {
      throw new Error("Failed to fetch image. Please try again.");
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

export const updateMedia = async (body: any) => {
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
      throw new Error("Failed to update images. Please try again.");
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

export const deleteMedia = async (fileUrl: string) => {
  try {
    const response: any = await axios.delete(
        url,
        {
          data: { fileUrl },
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

    if (!response?.statusText) {
      throw new Error("Failed to delete image. Please try again.");
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
