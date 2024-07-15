import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { signInSchema, SignInSchema } from "@/schemas/sign-in-schema";
import CustomInput from "@/misc/custom-input/custom-input";
import CustomButton from "@/misc/custom-button/custom-button";
import { Link } from "react-router-dom";

const SignInForm = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<SignInSchema>({
        resolver: zodResolver(signInSchema),
    });

    const onSubmit = (data: SignInSchema) => {
        console.log(data);
        // Handle sign-in logic here
    };

    const [signInBy, setSignInBy] = React.useState<"email" | "username">(
        "email"
    );

    return (
        <form>
            {signInBy === "email" ? (
                <div>
                    <CustomInput
                        label="Email"
                        type="email"
                        id="email"
                        register={register("email")}
                        error={errors.email?.message}
                    />
                </div>
            ) : (
                <div>
                    <CustomInput
                        label="Username"
                        type="text"
                        id="username"
                        register={register("username")}
                        error={errors.username?.message}
                    />
                </div>
            )}
            <button
                className="mb-4 w-full text-end text-sm font-thin"
                type="button"
                onClick={() =>
                    setSignInBy(signInBy === "email" ? "username" : "email")
                }
            >
                use{" "}
                <span className="text-orange-600">
                    {signInBy === "email" ? "username" : "email"}
                </span>{" "}
                instead
            </button>

            <div className="mb-6">
                <CustomInput
                    label="Password"
                    type="password"
                    id="password"
                    register={register("password")}
                    error={errors.password?.message}
                    className=""
                />
            </div>
            <div className="flex w-full mt-10 mb-6">
                <CustomButton
                    className="mx-auto"
                    onClick={handleSubmit(onSubmit)}
                    label="Sign In"
                />
            </div>
            <div className="text-center text-sm font-thin">don't have an account <Link to="/register" className="text-orange-600 font-semibold">Register</Link></div>
        </form>
    );
};

export default SignInForm;
