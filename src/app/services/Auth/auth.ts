const authUrl = `${process.env.NEXT_PUBLIC_API_URL}/auth`;
import axios from 'axios';
interface authType {
    type: string;
    email: string;
    action: string;
}


export const getAuth = async (id: string,body:authType) => {
    try {
        const response: any = await axios.post(
            `${authUrl}?id=${id}`,
            body,
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
        return await response?.data;
    } catch (error: any) {
        return error;
    }
};
