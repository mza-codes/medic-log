import { lazy, Suspense } from 'react';
import { Navigate, useRoutes } from 'react-router-dom';
import Loader from './Components/Loader/Loader';
import useAuthService from './Services/AuthService';

const Dashboard = lazy(() => import('./Pages/Dashboard'));
const AuthPage = lazy(() => import('./Pages/AuthPage'));

const Router = () => {

    const user = useAuthService(state => state.user);

    const ProtectedRoute = ({ children }) => {
        if (user) return children
        else return children;
        // <Navigate to="/login" />;
    };

    return useRoutes([
        {
            path: "/",
            element: <Navigate to="/login" />
        },
        {
            path: "/login",
            element: <ProtectedRoute>
                <Suspense fallback={<Loader />}>
                    <AuthPage login={1} />
                </Suspense>
            </ProtectedRoute>
        },
        {
            path: "/signup",
            element: <ProtectedRoute>
                <Suspense fallback={<Loader />}>
                    <AuthPage signup={1} />
                </Suspense>
            </ProtectedRoute>
        },
        {
            path: "/verify",
            element: <ProtectedRoute>
                <Suspense fallback={<Loader />}>
                    <AuthPage verify={1} />
                </Suspense>
            </ProtectedRoute>
        },
        {
            path: "/dashboard",
            element: <ProtectedRoute>
                <Suspense fallback={<Loader />}>
                    <Dashboard />
                </Suspense>
            </ProtectedRoute>
        },

    ]);
};

export default Router;