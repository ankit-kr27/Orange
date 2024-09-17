import { registerSchema, RegisterSchema } from "@/schemas/register-schema";
import { Button } from "@nextui-org/react";
import { useState } from "react";
import FormInput from "../form-input/form-input";
import LoadingOverlay from "../loading-overlay/loading-overlay";
import axios from "axios";

const RegisterComponent = ({
    setOperation,
}: {
    setOperation: React.Dispatch<React.SetStateAction<"login" | "register">>;
}) => {
    const [formData, setFormData] = useState<RegisterSchema>({
        email: "",
        password: "",
        avatar: null,
        fullName: "",
        username: "",
        coverImage: null,
    });

    const [errors, setErrors] = useState<
        Partial<Record<keyof RegisterSchema, string>>
    >({});
    const [loading, setLoading] = useState<boolean>(false);
    const [backendError, setBackendError] = useState<string | null>(null);

    const validateForm = () => {
        const result = registerSchema.safeParse({
            email: formData.email,
            password: formData.password,
            avatar: formData.avatar,
            fullName: formData.fullName,
            username: formData.username,
            coverImage: formData.coverImage,
        });

        if (!result.success) {
            const validationErrors: Partial<
                Record<keyof RegisterSchema, string>
            > = {};
            result.error.errors.forEach((err) => {
                validationErrors[err.path[0] as keyof RegisterSchema] =
                    err.message;
            });
            setErrors(validationErrors);
            return false;
        }
        setErrors({});
        return true;
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, files } = e.target;
        if (files && files.length > 0) {
            setFormData((prevData) => ({
                ...prevData,
                [id]: files[0],
            }));
        }
    };

    const onSubmit = async (e: React.FormEvent) => {
        setLoading(true);
        setBackendError(null);
        e.preventDefault();
        if (validateForm()) {
            const data = new FormData();
            data.append("email", formData.email);
            data.append("password", formData.password);
            data.append("fullName", formData.fullName);
            data.append("username", formData.username);
            if (formData.avatar) data.append("avatar", formData.avatar);
            if (formData.coverImage)
                data.append("coverImage", formData.coverImage);

            try {
                const response = await axios.post(
                    `${import.meta.env.VITE_BASE_URL}api/v1/users/register`,
                    data,
                    {
                        headers: {
                            "Content-Type": "multipart/form-data",
                        },
                        withCredentials: true,
                    }
                );

                // console.log(response)
                if (response.status === 201) {
                    console.log("Registeration successful!", response.data);
                    setOperation("login");
                }
            } catch (err) {
                if (axios.isAxiosError(err)) {
                    console.error(
                        "Error during registeration: ",
                        err.response?.data || err.message
                    );
                    setBackendError(
                        err.response?.data?.message ||
                            "Registeration failed. Please try again."
                    );
                }
            } finally {
                setLoading(false);
            }
        } else {
            setLoading(false);
        }
    };

    return (
        <form className="relative flex flex-col">
            <LoadingOverlay loading={loading} />
            <FormInput
                id="avatar"
                label="Avatar"
                type="file"
                onChange={handleFileChange}
                errorMessage={errors.avatar}
                accept="image/*"
            />
            <FormInput
                id="coverImage"
                label="Cover Image"
                type="file"
                onChange={handleFileChange}
                errorMessage={errors.coverImage}
                accept="image/*"
            />
            <FormInput
                id="email"
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                }
                errorMessage={errors.email}
            />
            <FormInput
                id="password"
                label="Password"
                type="password"
                value={formData.password}
                onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                }
                errorMessage={errors.password}
            />
            <FormInput
                id="fullName"
                label="Full Name"
                type="text"
                value={formData.fullName}
                onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                }
                errorMessage={errors.fullName}
            />
            <FormInput
                id="username"
                label="Username"
                type="text"
                value={formData.username}
                onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                }
                errorMessage={errors.username}
            />

            <Button
                type={"submit"}
                className="mx-auto my-6 px-6 py-6 text-lg font-semibold text-content1"
                onClick={onSubmit}
                color="primary"
                size="md"
            >
                Register
            </Button>
            {backendError && (
                <div className="mt-4 text-center text-red-500">
                    {backendError}
                </div>
            )}
        </form>
    );
};

export default RegisterComponent;
