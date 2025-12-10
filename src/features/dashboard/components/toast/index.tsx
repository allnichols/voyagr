import { Toast } from "../../hooks/useToast";

type ToastProps = {
  toasts: Toast[];
  onRemove: (id: string) => void;
};

export default function ToastComponent({ toasts, onRemove }: ToastProps) {
  const getAlertClass = (type: Toast["type"]) => {
    switch (type) {
      case "success":
        return "alert-success";
      case "error":
        return "alert-error";
      case "info":
      default:
        return "alert-info";
    }
  };

  return (
    <div className="toast toast-top toast-center z-2000">
      {toasts.map((toast) => (
        <div key={toast.id} className={`alert ${getAlertClass(toast.type)}`}>
          <span>{toast.message}</span>
          <button
            className="btn btn-sm btn-circle"
            onClick={() => onRemove(toast.id)}
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}
