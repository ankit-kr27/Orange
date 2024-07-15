import { Route, Routes } from "react-router-dom";
import AuthPage from "./pages/auth-page";
import { ThemeProvider } from "@/components/theme-provider";

function App() {
    return (
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <Routes>
                <Route path="/" element={<AuthPage />} />
            </Routes>
        </ThemeProvider>
    );
}

export default App;
