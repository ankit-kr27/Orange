import { useDispatch, useSelector } from 'react-redux';
import { Spinner } from '@nextui-org/react';
import { Navigate, Outlet } from 'react-router-dom';
import { useEffect } from 'react';
import { getCurrentUser } from '../features/auth/authSlice';

const ProtectedContainer = () => {
    const dispatch = useDispatch();
    const { user, isLoading } = useSelector((state) => state.auth);

    useEffect(() => {
        if (!user) {
            dispatch(getCurrentUser());
        }
    }, [dispatch]);

    if (isLoading) {
        return (
            <div className="min-h-[100vh] flex justify-center items-center">
                <Spinner />
            </div>
        );
    }

    if (user) {
        return (
            <div className="p-4 min-h-[100vh]">
                <Outlet />
            </div>
        );
    }

    // The redirection for the login page is handled by the axios interceptor in the lib folder
};

export default ProtectedContainer;
