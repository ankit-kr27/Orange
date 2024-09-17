import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "./provider.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
    <BrowserRouter>
        <Provider>
            <main className="bg-background text-content1">
                <App />
            </main>
        </Provider>
    </BrowserRouter>
);
