import { useEffect, useState } from "react";
import type { UseMutationResult } from "@tanstack/react-query";

export function useToastMutation(
    mutation: UseMutationResult<any, any, any, any>, duration = 3000
) {
    const [showToast, setShowToast] = useState(false);

    useEffect(() => {
        if (mutation.isSuccess || mutation.isError) {
            setShowToast(true);
            const timer = setTimeout(() => {
                setShowToast(false);
                mutation.reset()
            }, duration);

            return () => clearTimeout(timer);
        }
    }, [mutation.isSuccess, mutation.isError, duration, mutation]);

    const toast = showToast && (
        <div className="toast toast-center z-400">
            <div className={`alert ${mutation.isError ? "alert-error" : "alert-success"}`}>
                <span>
                    {mutation.isError
                        ? `Could not delete ${mutation.data ?? ""}`
                        : `Successfully deleted ${mutation.data?.place ?? ""}`}
                </span>
            </div>
        </div>
    );

    return toast;

}