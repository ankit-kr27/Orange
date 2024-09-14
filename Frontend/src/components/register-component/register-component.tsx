import { registerSchema, RegisterSchema } from "@/schemas/register-schema";
import { Button } from "@nextui-org/react";
import { useState } from "react";
import FormInput from "../form-input/form-input";

const RegisterComponent = () => {
    const [formData, setFormData] = useState<RegisterSchema>({
        email: "",
        password: "",
        avatar: null as File | null,
        fullName: "",
        username: "",
        coverImage: null as File | null,
    });

    const [errors, setErrors] = useState<Partial<Record<keyof RegisterSchema, string>>>({});

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
            const validationErrors: Partial<Record<keyof RegisterSchema, string>> = {};
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
        const {id, files } = e.target;
        if(files && files.length > 0){
          setFormData((prevData) => ({
            ...prevData,
            [id]: files[0],
          }))
        }
    }

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            const data = new FormData();
            data.append("email", formData.email);
            data.append("password", formData.password);
            data.append("fullName", formData.fullName);
            data.append("username", formData.username);
            if (formData.avatar) data.append("avatar", formData.avatar);
            if (formData.coverImage) data.append("coverImage", formData.coverImage);

            console.log("FormData:", data);
        }
    };

    return (
        <form className="flex flex-col">
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
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                errorMessage={errors.email}
            />
            <FormInput
                id="password"
                label="Password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                errorMessage={errors.password}
            />
            <FormInput
                id="fullName"
                label="Full Name"
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                errorMessage={errors.fullName}
            />
            <FormInput
                id="username"
                label="Username"
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                errorMessage={errors.username}
            />

            <Button
                type={"submit"}
                className="mx-auto text-lg text-content1 font-semibold px-6 py-6 my-6"
                onClick={onSubmit}
                color="primary"
                size="md"
            >
                Register
            </Button>
        </form>
    );
};

export default RegisterComponent;
