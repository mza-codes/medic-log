import { lazy } from 'react';
import { Navigate, useRoutes } from 'react-router-dom';
import useAuthService from './Services/AuthService';

const Dashboard = lazy(() => import('./Pages/Dashboard'));
const AuthPage = lazy(() => import('./Pages/AuthPage'));
const AddRecord = lazy(() => import('./Pages/AddRecord'));

const Router = () => {

    const userActive = useAuthService(state => state.active);
    // const user = useAuthService(state => state.user);

    const ProtectedRoute = ({ children }) => {
        if (userActive) return children;
        else return <Navigate to="/login" />;
    };

    const AuthRoute = ({ children }) => {
        if (!userActive) return children;
        else return <Navigate to="/dashboard" />;
    };

    return useRoutes([
        {
            path: "/",
            element: <Navigate to="/login" />
        },
        {
            path: "/login",
            element: <AuthRoute>
                <AuthPage login={1} />
            </AuthRoute>
        },
        {
            path: "/signup",
            element: <AuthRoute>
                <AuthPage signup={1} />
            </AuthRoute>
        },
        {
            path: "/verify",
            element: <AuthRoute>
                <AuthPage verify={1} />
            </AuthRoute>
        },
        {
            path: "/dashboard",
            element: <ProtectedRoute>
                <Dashboard />
            </ProtectedRoute>
        },
        {
            path: "/add-record",
            element: <ProtectedRoute>
                <AddRecord />
            </ProtectedRoute>
        },

    ]);
};

export default Router;