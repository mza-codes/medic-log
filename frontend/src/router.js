import { lazy } from 'react';
import { Navigate, useRoutes } from 'react-router-dom';
import useAuthService from './Services/AuthService';

const LandingPage = lazy(() => import('./Pages/LandingPage'));
const Dashboard = lazy(() => import('./Pages/Dashboard'));
const AuthPage = lazy(() => import('./Pages/AuthPage'));
const AddRecord = lazy(() => import('./Pages/AddRecord'));
const ViewRecords = lazy(() => import('./Pages/ViewRecords'));
const EditRecord = lazy(() => import('./Pages/EditRecord'));

const Router = () => {

    const userActive = useAuthService(state => state.active);

    const ProtectedRoute = ({ children }) => {
        if (userActive) return children;
        else return <Navigate to="/login" />;
        // return children;
    };

    const AuthRoute = ({ children }) => {
        if (!userActive) return children;
        else return <Navigate to="/dashboard" />;
        // return children;
    };

    return useRoutes([
        {
            path: "/",
            element: <LandingPage />
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
        {
            path: "/view-records",
            element: <ProtectedRoute>
                <ViewRecords />
            </ProtectedRoute>
        },
        {
            path: "/edit-record",
            element: <ProtectedRoute>
                <EditRecord />
            </ProtectedRoute>
        },

    ]);
};

export default Router;