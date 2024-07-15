import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { signInSchema, SignInSchema } from "@/schemas/sign-in-schema";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

const SignInComponent = () => {
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

    const [signInBy, setSignInBy] = React.useState<"email" | "username">("email");

    return (
        <form className="space-y-4">
            {signInBy === "email" ? (
                <div>
                    <label className="text-sm text-gray">Email</label>
                    <Input {...register("email")} type="email" />
                    {errors.email && <p>{errors.email.message}</p>}
                </div>
            ) : (
                <div>
                    <label>Username</label>
                    <Input {...register("username")} type="text" />
                    {errors.username && <p>{errors.username.message}</p>}
                </div>
            )}
            <div>
                <button
                    type="button"
                    onClick={() => setSignInBy(signInBy === "email" ? "username" : "email")}
                >
                    Use {signInBy === "email" ? "username" : "email"} instead
                </button>
            </div>
            <div>
                <label>Password</label>
                <Input {...register("password")} type="password" />
                {errors.password && <p>{errors.password.message}</p>}
            </div>
            <Button onClick={handleSubmit(onSubmit)}>Sign In</Button>
        </form>
    );
};

export default SignInComponent;
