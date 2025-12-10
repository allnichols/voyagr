import { useState } from "react";

export interface Toast {
  id: string;
  message: string;
  type: "info" | "success" | "error";
  duration?: number;
}

export default function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (
    message: string,
    type: Toast["type"] = "info",
    duration = 5000,
  ) => {
    const id = Math.random().toString();
    const newToast: Toast = { id, message, type, duration };
    setToasts((prevToasts) => [...prevToasts, newToast]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }

    return id;
  };

  const removeToast = (id: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  };

  const clearAllToasts = () => setToasts([]);

  const showSuccess = (message: string, duration?: number) => {
    addToast(message, "success", duration);
  };

  const showError = (message: string, duration?: number) => {
    addToast(message, "error", duration);
  };

  const showInfo = (message: string, duration?: number) => {
    addToast(message, "info", duration);
  };

  return {
    toasts,
    addToast,
    removeToast,
    clearAllToasts,
    showSuccess,
    showError,
    showInfo,
  };
}
