import { Route, Routes } from "react-router-dom";
import AuthPage from "./pages/auth-page";

function App() {
    return (
        <Routes>
            <Route path="/" element={<AuthPage />} />
        </Routes>
    );
}

export default App;
