"use client";

import { useEffect, useState } from "react";
import { FaCheckCircle, FaExclamationCircle, FaTimes } from "react-icons/fa";

export type ToastType = "success" | "error";

export type ToastMessage = {
  id: string;
  type: ToastType;
  text: string;
};

let toastIdCounter = 0;
let globalSetToasts: ((updater: (prev: ToastMessage[]) => ToastMessage[]) => void) | null = null;

export function showToast(type: ToastType, text: string) {
  const id = `toast-${++toastIdCounter}`;
  globalSetToasts?.((prev) => [...prev, { id, type, text }]);
  // Auto-dismiss after 4 seconds
  setTimeout(() => {
    globalSetToasts?.((prev) => prev.filter((t) => t.id !== id));
  }, 4000);
}

export default function ToastContainer() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    globalSetToasts = setToasts;
    return () => {
      globalSetToasts = null;
    };
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  if (toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`toast-item toast-${toast.type}`}
          role="alert"
        >
          {toast.type === "success" ? (
            <FaCheckCircle aria-hidden="true" />
          ) : (
            <FaExclamationCircle aria-hidden="true" />
          )}
          <span>{toast.text}</span>
          <button
            type="button"
            className="toast-close"
            onClick={() => removeToast(toast.id)}
            aria-label="Dismiss"
          >
            <FaTimes aria-hidden="true" />
          </button>
        </div>
      ))}
    </div>
  );
}
