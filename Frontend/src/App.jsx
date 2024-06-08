import Navbar from "./components/Navbar/Navbar";
import { Outlet } from "react-router-dom";

function App() {

    return (
        <div className="min-h-screen bg-bgPrimary">
            <Navbar />
            <main>
                <Outlet />
            </main>
        </div>
    );
}

export default App;
