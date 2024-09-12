import { nextui } from "@nextui-org/react";

const config = {
    darkMode: ["class"],
    content: [
        "./pages/**/*.{ts,tsx}",
        "./components/**/*.{ts,tsx}",
        "./app/**/*.{ts,tsx}",
        "./src/**/*.{ts,tsx}",
        "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
    ],
    prefix: "",
    theme: {
        extend: {},
    },
    plugins: [
        nextui({
            prefix: "nextui", // prefix for themes variables
            addCommonColors: false, // override common colors (e.g. "blue", "green", "pink").
            defaultTheme: "light", // default theme from the themes object
            defaultExtendTheme: "light", // default theme to extend on custom themes
            layout: {}, // common layout tokens (applied to all themes)
            themes: {
                light: {
                    layout: {}, // light theme layout tokens
                    colors: {
                        primary: "#eb5e28",
                        secondary: "#ff7d00",
                        content1: "#252422",
                        background: "#fff", 
                    },
                },
                dark: {
                    layout: {}, // dark theme layout tokens
                    colors: {
                        primary: "#eb5e28", // vibrant orange
                        secondary: "#ff7d00", // muted dark orange
                        content1: "#fffcf2", // light gray for text
                        background: "#252422", // deep, near-black
                    },
                },
                // ... custom themes
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

export default config;
