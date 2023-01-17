import { lazy } from 'react';
import { Navigate, useLocation, useRoutes } from 'react-router-dom';
import useAuthService from './Services/AuthService';

const LandingPage = lazy(() => import('./Pages/LandingPage'));
const Dashboard = lazy(() => import('./Pages/Dashboard'));
const AuthPage = lazy(() => import('./Pages/AuthPage'));
const AddRecord = lazy(() => import('./Pages/AddRecord'));
const ViewRecords = lazy(() => import('./Pages/ViewRecords'));
const EditRecord = lazy(() => import('./Pages/EditRecord'));
const DeleteRecord = lazy(() => import('./Pages/DeleteRecord'));
const Page404 = lazy(() => import('./Pages/Page404'));
const ViewDoc = lazy(() => import('./Pages/ViewDoc'));
const Profile = lazy(() => import('./Pages/Profile'));
const ForgotPassword = lazy(() => import('./Pages/ForgotPassword'));
const ChangePwd = lazy(() => import('./Pages/ChangePwd'));

const hexPattern = /[0-9a-fA-F]{24}/;
const Router = () => {
    const userActive = useAuthService(state => state.active);

    const ProtectedRoute = ({ children }) => {
        if (userActive) return children;
        else return <Navigate to="/login" />;
    };

    const AuthRoute = ({ children }) => {
        if (!userActive) return children;
        else return <Navigate to="/dashboard" />;
    };

    const VerifyId = ({ children }) => {
        const isHex = hexPattern.test(window.location.href?.split("/")?.at(-1));
        if (isHex) return children;
        else return <Page404 />
    };

    const VerifyPwdRoute = ({ children }) => {
        const { state } = useLocation();
        if (state === "change-pwd" && !userActive) return children;
        else return <Navigate to="/forgot-password" />;
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
            path: "/profile",
            element: <ProtectedRoute>
                <Profile />
            </ProtectedRoute>
        },
        {
            path: "/forgot-password",
            element: <AuthRoute>
                <ForgotPassword />
            </AuthRoute>
        },
        {
            path: "/change-password",
            element:
                <VerifyPwdRoute>
                    <ChangePwd />
                </VerifyPwdRoute>
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
            path: "/view-record/:id",
            element: <ProtectedRoute>
                <VerifyId>
                    <ViewDoc />
                </VerifyId>
            </ProtectedRoute>
        },
        {
            path: "/edit-record",
            element: <ProtectedRoute>
                <EditRecord />
            </ProtectedRoute>
        },
        {
            path: "/delete-record/:id",
            element: <ProtectedRoute>
                <VerifyId>
                    <DeleteRecord />
                </VerifyId>
            </ProtectedRoute>
        },
        {
            path: "/404",
            element: <Page404 />
        },
        {
            path: "*",
            element: <Page404 />
        },
    ]);
};

export default Router;