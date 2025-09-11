import { createContext, useContext, useRef } from "react";
import { Toast } from "primereact/toast";

type ToastOptions = Parameters<Toast["show"]>[0];

type ToastContextType = {
  show: (options: ToastOptions) => void;
  success: (msg: string, summary?: string) => void;
  info: (msg: string, summary?: string) => void;
  warn: (msg: string, summary?: string) => void;
  error: (msg: string, summary?: string) => void;
};

const ToastContext = createContext<ToastContextType | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const toastRef = useRef<Toast>(null);

  const show: ToastContextType["show"] = options => {
    toastRef.current?.show(options);
  };

  const success = (msg: string, summary = "Success") =>
    show({ severity: "success", summary, detail: msg });

  const info = (msg: string, summary = "Info") => show({ severity: "info", summary, detail: msg });

  const warn = (msg: string, summary = "Warning") =>
    show({ severity: "warn", summary, detail: msg });

  const error = (msg: string, summary = "Error") =>
    show({ severity: "error", summary, detail: msg });

  return (
    <ToastContext.Provider value={{ show, success, info, warn, error }}>
      <Toast ref={toastRef} position="top-right" />
      {children}
    </ToastContext.Provider>
  );
}

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside ToastProvider");
  return ctx;
};
