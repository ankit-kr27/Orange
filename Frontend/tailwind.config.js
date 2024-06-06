/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            colors: {
                primary: "#EB5E28",
                bgPrimary: "#252422",
                bgSecondary: "#403D39",
                txtPrimary: "#FFFCF2",
                txtSecondary: "#CCC5B9",
            },
        },
    },
    plugins: [],
};
