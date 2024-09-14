import { useState, useEffect } from "react";
import { Switch } from "@nextui-org/react";
import { SunIcon } from "@/misc/sun-icon"
import { MoonIcon } from "@/misc/moon-icon";

export default function ThemeToggleSwitch() {
    const [isDarkMode, setIsDarkMode] = useState(
        () => localStorage.getItem("theme") === "dark"
    );

    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add("dark");
            localStorage.setItem("theme", "dark");
        } else {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("theme", "light");
        }
    }, [isDarkMode]);

    const handleThemeChange = () => {
        setIsDarkMode(!isDarkMode);
    };

    return (
        <div className={`absolute right-1 top-4`}>
            <Switch
                isSelected={isDarkMode}
                size="lg"
                color="secondary"
                onChange={handleThemeChange}
                thumbIcon={({ isSelected, className }) =>
                    isSelected ? (
                        <SunIcon className={className} />
                    ) : (
                        <MoonIcon className={className} />
                    )
                }
            >
            </Switch>
        </div>
    );
}
