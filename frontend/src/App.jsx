import './index.css';
import Header from './Components/Header';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Homepage from './Pages/Homepage';
import useAuthService from './Services/AuthService';
import Dashboard from './Pages/Dashboard';

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
                    {/* <Route path="/" element={<ProtectedRoute><Homepage /></ProtectedRoute>} /> */}
                    <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />

                </Routes>

            </HashRouter>
        </>
    )
};

export default App;