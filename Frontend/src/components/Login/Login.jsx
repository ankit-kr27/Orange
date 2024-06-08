import React, {useEffect, useState} from "react";
import { useForm, FormProvider } from "react-hook-form";
import InputBox from "../InputBox/InputBox";
import Button from "../Button/Button";
import {useDispatch, useSelector} from "react-redux";
import { login } from "../../features/authSlice";
import { closeLoginModal, openRegisterModal } from "../../features/loginModalSlice";
import Loader from "../Loader/Loader";

const Login = () => {
    const methods = useForm();
    const [loginVia, setLoginVia] = useState("email");
    // const [err, setErr] = useState("");
    const [loading, setLoading] = useState(false);

    const dispatch = useDispatch();
    const { user, error } = useSelector((state) => state.auth);
    // const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            // navigate("/");
            dispatch(closeLoginModal())
        }
    }, [user, dispatch]);

    const loginUser = async (data) => {
        setLoading(true);
        try {
            dispatch(login(data));
            setLoading(false);
        } catch (err) {
            console.log(err);
        }
    };

    const toggleLoginVia = () => {
        setLoginVia((prev) => (prev === "email" ? "username" : "email"));
    };

    if (loading) return <Loader />;

    return (
        <div className="flex flex-col items-center h-full">
            <p className="text-txtPrimary mt-4 mb-2 font-normal text-base">Nice to see you again</p>
            <FormProvider {...methods}>
                <form onSubmit={methods.handleSubmit(loginUser)} className="flex flex-col">
                    {loginVia === "email" ? (
                        <InputBox
                            name="email"
                            type="email"
                            placeholder="Email"
                            rules={{
                                required: "Email is required",
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                                    message: "Invalid email address",
                                },
                            }}
                        />
                    ) : (
                        <InputBox
                            name="username"
                            type="text"
                            placeholder="Username"
                            rules={{
                                required: "Username is required",
                                pattern: {
                                    value: /^[A-Za-z0-9_]{1,15}$/,
                                    message: "Invalid username",
                                },
                            }}
                        />
                    )}
                    <p onClick={toggleLoginVia} className="text-txtPrimary text-[14px] text-right font-light cursor-pointer">
                        Use{" "}
                        <span>
                            {loginVia === "email" ? "username" : "email"}
                        </span>{" "}
                        instead
                    </p>

                    <InputBox
                        name="password"
                        type="password"
                        placeholder="Password"
                        rules={{
                            required: "Password is required",
                            minLength: {
                                value: 6,
                                message:
                                    "Password must have at least 6 characters",
                            },
                        }}
                    />

                    <Button type="submit" className="mt-24 mx-auto">Login</Button>
                </form>
            </FormProvider>
            <p className="text-txtPrimary mt-6 font-light">
                Don&apos;t have an account?{" "}
                <span onClick={()=>dispatch(openRegisterModal())} className="text-primary font-semibold cursor-pointer">
                    register
                </span>
            </p>
            {error && <span>{error.message}</span>}
        </div>
    );
};

export default Login;
