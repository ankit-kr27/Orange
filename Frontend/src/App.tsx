import { Route, Routes } from "react-router-dom";
import AuthPage from "./pages/auth-page";
import HomePage from "./pages/home-page";

function App() {
    return (
        <Routes>
            <Route path="/" element={<AuthPage />} />
            <Route path="/home" element={<HomePage />} />
        </Routes>
    );
}

export default App;
