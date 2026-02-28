"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";

type ToastType = "success" | "error" | "info";

interface ToastItem {
    id: number;
    message: string;
    type: ToastType;
}

interface ToastContextType {
    show: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType>({ show: () => { } });

export function useToast() {
    return useContext(ToastContext);
}

const icons: Record<ToastType, string> = {
    success: "✅",
    error: "❌",
    info: "ℹ️",
};

const colors: Record<ToastType, string> = {
    success: "border-emerald-500/30 bg-emerald-500/10",
    error: "border-red-500/30 bg-red-500/10",
    info: "border-blue-500/30 bg-blue-500/10",
};

let globalId = 0;

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<ToastItem[]>([]);

    const show = useCallback((message: string, type: ToastType = "success") => {
        const id = ++globalId;
        setToasts((prev) => [...prev, { id, message, type }]);
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 4000);
    }, []);

    return (
        <ToastContext.Provider value={{ show }}>
            {children}
            <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2 max-w-sm">
                {toasts.map((toast) => (
                    <div
                        key={toast.id}
                        className={`px-4 py-3 rounded-xl border backdrop-blur-xl text-sm text-white flex items-center gap-2 shadow-lg animate-fade-in-up ${colors[toast.type]}`}
                    >
                        <span>{icons[toast.type]}</span>
                        <span>{toast.message}</span>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
}
