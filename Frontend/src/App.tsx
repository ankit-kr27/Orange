import { Route, Routes } from "react-router-dom";
import AuthPage from "./pages/auth-page";
import HomePage from "./pages/home-page";
import ProtectedRoutes from "./components/protected-routes/protected-routes";

function App() {
    return (
        <Routes>
            <Route path="/" element={<AuthPage />} />
            <Route element={<ProtectedRoutes />}>
                <Route path="/home" element={<HomePage />} />
            </Route>
        </Routes>
    );
}

export default App;
