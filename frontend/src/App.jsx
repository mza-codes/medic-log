import './index.css';
import Header from './Components/Header';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Homepage from './Pages/Homepage';

const App = () => {

    const user = true;

    const ProtectedRoute = ({ children }) => {
        if (user) return children
        else <Navigate to="/" />;
    };

    return (
        <>
            <HashRouter hashType="hashbang">
                <Header />

                <Routes>
                    <Route path="/" element={<ProtectedRoute><Homepage /></ProtectedRoute>} />

                </Routes>

            </HashRouter>
        </>
    )
};

export default App;