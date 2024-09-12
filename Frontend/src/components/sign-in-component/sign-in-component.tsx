import React, { useState } from "react";
import { signInSchema, SignInSchema } from "@/schemas/sign-in-schema";
import { Button, Input } from "@nextui-org/react";

const SignInComponent = () => {
    const [formData, setFormData] = useState<SignInSchema>({
        email: "",
        password: "",
        username: "",
    });

    const [signInBy, setSignInBy] = useState<"email" | "username">("email");
    const [errors, setErrors] = useState<Partial<SignInSchema>>({});

    const validateForm = () => {
        const result = signInSchema.safeParse({
            email: signInBy === "email" ? formData.email : undefined,
            username: signInBy === "username" ? formData.username : undefined,
            password: formData.password,
        });

        if (!result.success) {
            const validationErrors: Partial<SignInSchema> = {};
            result.error.errors.forEach((err) => {
                validationErrors[err.path[0] as keyof SignInSchema] =
                    err.message;
            });
            setErrors(validationErrors);
            return false;
        }

        setErrors({});
        return true;
    };

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            console.log(formData);
        }
    };

    return (
        <form className="mt-6">
            {signInBy === "email" ? (
                <div>
                    <Input
                        label="Email"
                        type="email"
                        id="email"
                        value={formData.email}
                        errorMessage={errors.email}
                        placeholder="Enter your email"
                        variant="bordered"
                        color="primary"
                    />
                </div>
            ) : (
                <div>
                    <Input
                        label="Username"
                        type="text"
                        id="username"
                        value={formData.username}
                        errorMessage={errors.username}
                        variant="bordered"
                        color="primary"
                    />
                </div>
            )}
            <p className="mb-4 w-full text-end text-sm font-thin">
                use{" "}
                <span
                    className="text-orange-600 font-normal"
                    onClick={() =>
                        setSignInBy(signInBy === "email" ? "username" : "email")
                    }
                >
                    {signInBy === "email" ? "username" : "email"}
                </span>{" "}
                instead
            </p>

            <div className="mb-6">
                <Input
                    label="Password"
                    type="password"
                    id="password"
                    value={formData.password}
                    errorMessage={errors.password}
                    variant="bordered"
                    color="primary"
                />
            </div>
            <div className="mb-6 mt-10 flex w-full">
                <Button className="mx-auto text-background" onClick={onSubmit} color="primary" size="lg">
                    Sign In
                </Button>
            </div>
        </form>
    );
};

export default SignInComponent;
