import useToast from "@/util/toast";


export const copyToClipboard = async (text: string): Promise<void> => {
    const { showToast } = useToast();

    try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            await navigator.clipboard.writeText(text);
            showToast({
                type: "success", message: "Copied to clipboard"
            });
        } else {

            const textarea = document.createElement("textarea");
            textarea.value = text;
            textarea.style.position = "fixed";
            document.body.appendChild(textarea);
            textarea.focus();
            textarea.select();

            try {
                const successful = document.execCommand('copy');
                if (successful) {
                    showToast({ type: "success", message: "Copied to clipboard" });
                } else {
                    showToast({ type: "error", message: "Failed to copy: document.execCommand('copy') failed." });
                }
            } catch (err) {
                showToast({ type: "error", message: "Failed to copy: " + err });
            } finally {
                document.body.removeChild(textarea);
            }

        }
    } catch (error: any) {
        showToast({
            type: "error", message: "Failed to copy: " + error
        });
    }
};


export const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');

    return `${day}-${month}-${year}`;
}

export const convertImageToBase64 = async (imageUrl: string) => {
    try {
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        const result = new Promise((resolve) => {
            const reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onloadend = () => resolve(reader.result);
        });
        
        return result;
        
    } catch (error) {
        console.error("Error converting image to Base64:", error);
        return null;
    }
};

export const getBase64ImageFromURL = async (imageUrl : string) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/proxy?url=${encodeURIComponent(imageUrl)}`);
    const blob = await response.blob();

    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
};

export const getBase64Image = async (imageUrl: string) => {
    const response = await fetch(imageUrl);
    const blob = await response.blob();

    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
};