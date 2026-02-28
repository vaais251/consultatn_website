"use client";

import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";
import { ToastProvider } from "@/app/components/Toast";
import { ThemeProvider } from "@/app/components/ThemeProvider";

export default function Providers({ children }: { children: ReactNode }) {
    return (
        <SessionProvider>
            <ThemeProvider>
                <ToastProvider>{children}</ToastProvider>
            </ThemeProvider>
        </SessionProvider>
    );
}
