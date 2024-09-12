import SignInComponent from "@/components/sign-in-component/sign-in-component";
import { useState } from "react";
import RegisterComponent from "../register-component/register-component";

const AuthComponent = () => {
    const [operation, setOperation] = useState<"signin" | "register">("signin");

    const toggleOperation = () => {
        operation === "register"
            ? setOperation("signin")
            : setOperation("register");
    };

    return (
        <div className="mx-auto max-w-sm flex-1 rounded-lg border-2 border-gray-500 p-8 py-10">
            <h1 className="text-center text-4xl font-extrabold text-orange-600">
                ORANGE
            </h1>
            {operation === 'register' ? <RegisterComponent /> : <SignInComponent />}
            <div className="text-center text-sm font-thin">
            {operation === "register" ? "Already " : "Don't "}
                have an account{" "}
                <button
                    onClick={toggleOperation}
                    className="font-normal text-orange-600"
                >
                    {operation === "register" ? "Signin" : "Register"}
                </button>
            </div>
        </div>
    );
};

export default AuthComponent;
