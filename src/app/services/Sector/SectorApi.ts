export const getSectorList = async () => {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/companySector`;
    const response = await fetch(url, {
      method: "GET",
    });
  
    if (!response.ok) {
      throw new Error("Failed to fetch product data. Please try again.");
    }
    return await response.json();
  }
  