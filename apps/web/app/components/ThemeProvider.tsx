"use client";

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
    theme: Theme;
    setTheme: (t: Theme) => void;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
    theme: "light",
    setTheme: () => { },
    toggleTheme: () => { },
});

export function useTheme() {
    return useContext(ThemeContext);
}

export function ThemeProvider({ children }: { children: ReactNode }) {
    const [theme, setThemeState] = useState<Theme>("light");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        // Read from what the anti-FOUC script already applied
        const current = document.documentElement.classList.contains("dark") ? "dark" : "light";
        setThemeState(current);
        setMounted(true);
    }, []);

    const setTheme = useCallback((t: Theme) => {
        setThemeState(t);
        localStorage.setItem("theme", t);
        if (t === "dark") {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    }, []);

    const toggleTheme = useCallback(() => {
        setTheme(theme === "dark" ? "light" : "dark");
    }, [theme, setTheme]);

    // Avoid hydration mismatch — render children immediately but
    // only provide correct theme value after mount
    return (
        <ThemeContext.Provider value={{ theme: mounted ? theme : "light", setTheme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}
