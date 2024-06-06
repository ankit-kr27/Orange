import {useNavigate} from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Loader from "../Loader/Loader";
import { useDispatch } from "react-redux";
import { openLoginModal } from "../../features/loginModalSlice";

const AuthLayout = ({children, authenticationRequired = true}) => {
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

    useEffect(() => {
        if (authenticationRequired && !isAuthenticated) {
            dispatch(openLoginModal());
        } else if(!authenticationRequired && isAuthenticated) {
            navigate("/");
        }
        setLoading(false);
    }, [isAuthenticated, navigate, authenticationRequired, dispatch]);

    return loading ? <Loader /> : <>{children}</>;
};

export default AuthLayout;
