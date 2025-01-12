import { nextui } from '@nextui-org/react';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {},
    },
    darkMode: 'class',
    plugins: [
        nextui({
            themes: {
                light: {
                    colors: {
                        // Customize NextUI's light theme colors
                    },
                },
                dark: {
                    colors: {
                        // The dark theme should be of orange and dark gray colors
                        primary: '#e76f51',
                        secondary: '#2a9d8f',
                        background: '#1a1a1a',
                        foreground: '#f0f0f0',
                        text: '#f0f0f0',
                    },
                },
            },
        }),
        function ({ addUtilities }) {
            addUtilities({
                ".scrollbar-thin": {
                    "&::-webkit-scrollbar": {
                        width: "6px",
                        marginTop: "2px",
                        marginBottom: "2px",
                    },
                    "&::-webkit-scrollbar-thumb": {
                        backgroundColor: "#d1d5db",
                        borderRadius: "6px",
                    },
                    "&::-webkit-scrollbar-track": {
                        backgroundColor: "transparent",
                    },
                },
            });
        },
    ],
};
