import { useEffect, useState } from "react";
import type { UseMutationResult } from "@tanstack/react-query";

export function useToastMutation(
  mutation: UseMutationResult<any, any, any, any>,
  duration = 3000,
  message?: string
) {
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    if (mutation.isSuccess || mutation.isError) {
      setShowToast(true);
      const timer = setTimeout(() => {
        setShowToast(false);
        mutation.reset();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [mutation.isSuccess, mutation.isError, duration, mutation]);

  const toast = showToast && (
    <div className="toast toast-center z-900">
      <div
        className={`alert ${mutation.isError ? "alert-error" : "alert-success"}`}
      >
        <span>
          {message ? message : ""}
          {mutation.isError ? mutation.error.message : "Operation successful!"}
        </span>
      </div>
    </div>
  );

  return toast;
}
