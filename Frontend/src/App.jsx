import Navbar from "./components/Navbar/Navbar";
import { Outlet } from "react-router-dom";

function App() {
    return (
        <div className="bg-bgPrimary min-h-screen">
            <Navbar />
            <main>
                <Outlet />
            </main>
        </div>
    );
}

export default App;
