import React, { useState } from "react";
import { logInSchema, LogInSchema } from "@/schemas/log-in-schema";
import { Button, Input } from "@nextui-org/react";
import LoadingOverlay from "../loading-overlay/loading-overlay";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { RootState } from "@/app/store";
import { loginUser } from "@/features/auth-slice";
import { useNavigate } from "react-router-dom";

const LogInComponent = () => {
    const navigate = useNavigate();

    const dispatch = useAppDispatch();
    const { loading, error } = useAppSelector((state: RootState) => state.auth)

    const [formData, setFormData] = useState<LogInSchema>({
        email: "",
        password: "",
        username: "",
    });

    const [logInBy, setLogInBy] = useState<"email" | "username">("email");
    const [errors, setErrors] = useState<Partial<LogInSchema>>({});

    const validateForm = () => {
        const result = logInSchema.safeParse({
            email: logInBy === "email" ? formData.email : undefined,
            username: logInBy === "username" ? formData.username : undefined,
            password: formData.password,
        });

        if (!result.success) {
            const validationErrors: Partial<LogInSchema> = {};
            result.error.errors.forEach((err) => {
                validationErrors[err.path[0] as keyof LogInSchema] =
                    err.message;
            });
            setErrors(validationErrors);
            return false;
        }

        setErrors({});
        return true;
    };

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            try {
                await dispatch(loginUser(formData))
                navigate("/home");
            } catch (error) {
                console.error("Login failed: ", error);
            }
        }
    };

    return (
        <form>
            <LoadingOverlay loading={loading} />
            {logInBy === "email" ? (
                <div>
                    <Input
                        label="Email"
                        type="email"
                        id="email"
                        value={formData.email}
                        errorMessage={errors.email}
                        variant="bordered"
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
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
                        onChange={(e) => setFormData({...formData, username: e.target.value})}
                    />
                </div>
            )}
            <p className="mb-4 w-full text-end text-sm font-thin">
                use{" "}
                <span
                    className="text-orange-600 font-normal cursor-pointer"
                    onClick={() =>
                        setLogInBy(logInBy === "email" ? "username" : "email")
                    }
                >
                    {logInBy === "email" ? "username" : "email"}
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
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
            </div>
            <div className="mb-6 mt-10 flex w-full">
                <Button className="mx-auto text-lg text-content1 font-semibold px-6 py-6" onClick={onSubmit} color="primary" size="md">
                    Log In
                </Button>
            </div>
            {error && (
                <div className="mt-4 text-center text-red-500">
                    {error}
                </div>
            )}
        </form>
    );
};

export default LogInComponent;
