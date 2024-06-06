import React, { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import InputBox from "../InputBox/InputBox";
import Button from "../Button/Button";
import { register } from "../../features/registerSlice";
import { useDispatch } from "react-redux";
import { openLoginModal } from "../../features/loginModalSlice";
import { useSelector } from "react-redux";
import Loader from "../Loader/Loader";

const Register = () => {
    const methods = useForm();

    const [step, setStep] = useState(1);
    const [avatar, setAvatar] = useState(null);
    const [err, setErr] = useState("");
    const [avatarPreview, setAvatarPreview] = useState(null);
    const [loading, setLoading] = useState(false);

    const {error} = useSelector((state) => state.register);

    const dispatch = useDispatch();

    const handleAvatarChange = (event) => {
        setErr("");
        // errors.avatar = null; 
        const file = event.target.files[0]; 
        if (file && file.type.substr(0, 5) === "image") {
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result); 
            };
            reader.readAsDataURL(file);
            // setValue("avatar", file);
            setAvatar(file)
        }
        else{
            setAvatarPreview(null);
            // setValue("avatar", null);
            setAvatar(null)
            setErr("Invalid Image")
        }
    }

    const handleNext = () => {
        methods
            .trigger(["email", "password", "confirmPassword"])
            .then((valid) => {
                if (valid) {
                    setStep(2);
                }
            });
    };

    const handlePrev = () => {
        setStep(1);
    };

    const registerUser = async (data) => {
        setLoading(true);
        const formData = new FormData();
        formData.append("email", data.email);
        formData.append("password", data.password);
        formData.append("username", data.username);
        formData.append("fullName", data.fullName);
        formData.append("avatar", avatar);
        try{
            dispatch(register(formData));
            setLoading(false);
        }catch(error){
            console.log(error.message);
            setErr(error.message);
        }

    };

    if (loading) return <Loader />;    

    return (
        <div>
            <p>Welcome Onboard</p>
            <FormProvider {...methods}>
                <form onSubmit={methods.handleSubmit(registerUser)}>
                    {step === 1 && (
                        <>
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
                            <Button type="button" onClick={handleNext}>
                                Next
                            </Button>
                        </>
                    )}
                    {step === 2 && (
                        <>
                            <label
                                htmlFor="avatar"
                                className="text-shade7 m-4 flex cursor-pointer flex-col items-center"
                            >
                                <span className="text-xs">Upload Avatar</span>
                                {avatarPreview ? (
                                    <img
                                        className="h-[7vw] w-[7vw] rounded-full object-cover"
                                        src={avatarPreview}
                                        alt="Avatar Preview"
                                    />
                                ) : (
                                    <svg
                                        className="h-[5vw] w-[5vw]"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="currentColor"
                                    >
                                        <path d="M15 4H5V20H19V8H15V4ZM3 2.9918C3 2.44405 3.44749 2 3.9985 2H16L20.9997 7L21 20.9925C21 21.5489 20.5551 22 20.0066 22H3.9934C3.44476 22 3 21.5447 3 21.0082V2.9918ZM13 12V16H11V12H8L12 8L16 12H13Z"></path>
                                    </svg>
                                )}
                            </label>
                            <InputBox
                                id="avatar"
                                onChange={handleAvatarChange}
                                name="avatar"
                                type="file"
                                placeholder="Avatar"
                            />
                            <InputBox
                                name="username"
                                type="text"
                                placeholder="Username"
                                rules={{
                                    required: "Username is required",
                                }}
                            />
                            <InputBox
                                name="Full Name"
                                type="text"
                                placeholder="Full Name"
                                rules={{
                                    required: "Full Name is required",
                                }}
                            />
                            <Button type="button" onClick={handlePrev}>
                                Previous
                            </Button>
                            <Button type="submit">Register</Button>
                        </>
                    )}
                </form>
            </FormProvider>
            <p>
                Already have an account?{" "}
                <span onClick={() => dispatch(openLoginModal())}>login</span>
            </p>
            {err && <span>{err}</span>}
        </div>
    );
};

export default Register;
