import { useAppSelector } from '@/app/hooks';
import { RootState } from '@/app/store';
import { Navigate, Outlet } from 'react-router-dom';

function ProtectedRoutes() {
    const { user } = useAppSelector((state: RootState) => state.auth);

    return user ? <Outlet /> : <Navigate to="/" replace />;
}

export default ProtectedRoutes
