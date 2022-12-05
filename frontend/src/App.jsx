import './index.css';

import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import useAuthService from './Services/AuthService';
import { lazy, Suspense } from 'react';
import Loader from './Components/Loader/Loader';
import Header from './Components/Header';

const Dashboard = lazy(() => import('./Pages/Dashboard'));
const AuthPage = lazy(() => import('./Pages/AuthPage'));

const App = () => {

    const { user } = useAuthService();

    const ProtectedRoute = ({ children }) => {
        if (user) return children
        else return children;
        // <Navigate to="/" />;
    };

    return (
        <>
            <HashRouter hashType="hashbang">
                <Header />

                <Routes>
                    <Route path="/login" element={
                        <ProtectedRoute>
                            <Suspense fallback={<Loader />}>
                                <AuthPage login />
                            </Suspense>
                        </ProtectedRoute>
                    } />

                    <Route path="/" element={<Navigate to="/login" />} />

                    <Route path="/signup" element={
                        <ProtectedRoute>
                            <Suspense fallback={<Loader />}>
                                <AuthPage signup />
                            </Suspense>
                        </ProtectedRoute>
                    } />

                    <Route path="/verify" element={
                        <ProtectedRoute>
                            <Suspense fallback={<Loader />}>
                                <AuthPage verify />
                            </Suspense>
                        </ProtectedRoute>
                    } />

                </Routes>

            </HashRouter>
        </>
    )
};

export default App;