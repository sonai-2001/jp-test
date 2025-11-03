import axios from 'axios';
import useToast from '@/util/toast';

const url = `${process.env.NEXT_PUBLIC_API_URL}/catalogue`;
const { showToast } = useToast();

export const createCatalogue = async (body: any) => {
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
      throw new Error("Failed to create catalogue. Please try again.");
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

export const getCatalogues = async () => {
  try {
    const response: any = await axios.get(url);

    if (!response?.statusText) {
      throw new Error("Failed to fetch catalogues. Please try again.");
    }
    return await response.data;
  } catch (error: any) {
    if (error) {
      showToast({
        type: "error", message: error.response.data.error ? error.response.data.error : error.response.data.message
      });
      throw new Error(error.response.data.error);
    }
    return error;
  }
};

export const getOneCatalogue = async (id: string) => {
  try {
    const response: any = await axios.get(
      `${url}?id=${id}`
    );

    if (!response?.statusText) {
      throw new Error("Failed to fetch catalogue. Please try again.");
    }

    return await response.data;
  } catch (error: any) {
    if (error) {
      showToast({
        type: "error", message: error.response.data.message ? error.response.data.message : error.response.data.error
      });
      throw new Error(error.response.data.error);
    }
    return error;
  }
};

export const updateCatalogue = async (body: any) => {
  try {
  console.log('🚀 ~ updateCatalogue ~ body:', body)
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
      throw new Error("Failed to update catalogue. Please try again.");
    } else {
      showToast({
        type: "success", message: response.data.message
      });
    }
    return await response.data;
  } catch (error: any) {
    if (error) {
      showToast({
        type: "error", message: error.response.data.message ? error.response.data.message : error.response.data.error
      });
      throw new Error(error.response.data.error);
    }
    return error;
  }
};
console.log("🚀 ~ updateCatalogue ~ updateCatalogue:", updateCatalogue)
console.log("🚀 ~ updateCatalogue ~ updateCatalogue:", updateCatalogue)
console.log("🚀 ~ updateCatalogue ~ updateCatalogue:", updateCatalogue)
console.log("🚀 ~ updateCatalogue ~ updateCatalogue:", updateCatalogue)

export const deleteCatalogue = async (id: string) => {
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
      throw new Error("Failed to delete catalogue. Please try again.");
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
