import { NextUIProvider } from '@nextui-org/system';
import { useNavigate } from 'react-router-dom';
import { Provider as ReduxProvider } from 'react-redux';

import { store } from './app/store';
import { useEffect } from 'react';

export function Provider({ children }: { children: React.ReactNode }) {
    const isDarkMode = localStorage.getItem("theme") === "dark";

    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add("dark");
            localStorage.setItem("theme", "dark");
        } else {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("theme", "light");
        }
    }, [isDarkMode]);
    
    const navigate = useNavigate();

    return (
        <ReduxProvider store={store}>
            <NextUIProvider navigate={navigate}>
                {children}
            </NextUIProvider>
        </ReduxProvider>
    );
}
