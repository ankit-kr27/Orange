import React from "react";
import Button from "../Button/Button";
import { useDispatch } from "react-redux";
import { closeLoginModal } from "../../features/loginModalSlice";
import { useSelector } from "react-redux";
import Login from "../Login/Login";
import Register from "../Register/Register";

const LoginModal = () => {
    const dispatch = useDispatch();
    const {isOpen, type} = useSelector((state) => state.loginModal);

    if (!isOpen) return null;
    return (
        <div>
            <div>
                <Button onClick={() => dispatch(closeLoginModal())}>Close</Button>
                {type === "login" ? <Login /> : <Register />}
            </div>
        </div>
    );
};

export default LoginModal;
