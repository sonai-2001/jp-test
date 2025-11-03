import useToast from "@/util/toast";


const url = `${process.env.NEXT_PUBLIC_API_URL}/user`;
const { showToast } = useToast();

export const AdminLoginApi = async (formData:any) => {
    
    try {
        const response = await fetch(
            url,
            {
                method: "POST",
                body: JSON.stringify(formData),
            }
        );

      if (!response?.statusText) {
            throw new Error("Failed to create product. Please try again.");
        } 
        // else {
        //     showToast({
        //         type: "success", message: response.data.message
        //     });
        // }
        return await response
    } catch (error) {
        if (error) {
            showToast({
                type: "error", message: `${error}`
            });
            throw new Error(`${error}`);
        }
        return error;
    }
};