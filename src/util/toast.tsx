import { toast } from "react-hot-toast";

type ToastType = "success" | "error" | "info" | "loading";

interface ToastOptions {
  type: ToastType;
  message: string;
}

const useToast = () => {
  const showToast = ({ type, message }: ToastOptions): string | undefined => {
    let toastId: string | undefined;

    switch (type) {
      case "success":
        toast.success(message);
        break;
      case "error":
        toast.error(message);
        break;
      case "info":
        toast(message); // Default style
        break;
      case "loading":
        toastId = toast.loading(message);
        break;
      default:
        toast(message); // Fallback for unknown types
        break;
    }

    return toastId; // Return toast ID for "loading"
  };

  const dismissToast = (toastId: string): void => {
    toast.dismiss(toastId);
  };

  const updateToast = (
    toastId: string | undefined,
    message: string,
    type: ToastType = "success"
  ): void => {
    switch (type) {
      case "success":
        toast.success(message, { id: toastId });
        break;
      case "error":
        toast.error(message, { id: toastId });
        break;
      case "info":
        toast(message, { id: toastId });
        break;
      default:
        toast(message, { id: toastId });
        break;
    }
  };

  return { showToast, dismissToast, updateToast };
};

export default useToast;
