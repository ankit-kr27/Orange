import LogInComponent from "@/components/log-in-component/log-in-component";
import { useState } from "react";
import RegisterComponent from "../register-component/register-component";

const AuthComponent = () => {
    const [operation, setOperation] = useState<"login" | "register">("login");

    const toggleOperation = () => {
        operation === "register"
            ? setOperation("login")
            : setOperation("register");
    };

    return (
        <div className="mx-auto max-w-sm flex-1 rounded-xl border-2 border-gray-600/80 p-8 py-10">
            <h1 className="text-center text-4xl font-extrabold text-orange-600 mb-6">
                ORANGE
            </h1>
            {operation === 'register' ? <RegisterComponent setOperation={setOperation} /> : <LogInComponent />}
            <div className="text-center text-sm font-thin">
            {operation === "register" ? "Already " : "Don't "}
                have an account{" "}
                <button
                    onClick={toggleOperation}
                    className="font-normal text-orange-600"
                >
                    {operation === "register" ? "Login" : "Register"}
                </button>
            </div>
        </div>
    );
};

export default AuthComponent;
