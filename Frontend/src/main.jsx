import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./app/store.js";
import AuthLayout from "./components/AuthLayout/AuthLayout.jsx";
import HomePage from "./pages/HomePage.jsx";


const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        errorElement: <div>404 Not Found</div>,
        children: [
            {
                path: "/",
                element: (
                    <AuthLayout authenticationRequired={true}>
                        <HomePage />
                    </AuthLayout>
                ),
            },
            {
                path: "*",
                element: <div>404 Not Found</div>,
            },
        ],
    },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
    <Provider store={store}>
        <RouterProvider router={router} />
    </Provider>
);
