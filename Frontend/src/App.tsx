import { Route, Routes } from "react-router-dom";
import AuthPage from "./pages/auth-page";
import HomePage from "./pages/home-page";
import ProtectedRoutes from "./components/protected-routes/protected-routes";
import { useEffect } from "react";
import { useAppDispatch } from "./app/hooks";
import { currentUser } from "./features/auth-slice";

function App() {
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(currentUser());
    }, [dispatch]);

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
