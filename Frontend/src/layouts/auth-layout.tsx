import ThemeToggleSwitch from "@/components/theme-toggle-switch/theme-toggle-switch";
import React from "react";

function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <section className="max-w-7x inset-0 m-auto flex min-h-screen items-center">
            <ThemeToggleSwitch />
            {children}
        </section>
    );
}

export default AuthLayout;
