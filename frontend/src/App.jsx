import './index.css';
import { HashRouter } from 'react-router-dom';
import Header from './Components/Header';
import Router from './router';
import { Suspense } from 'react';
import Loader from './Components/Loader/Loader';

const App = () => {

    return (
        <>
            <HashRouter hashType="hashbang">
                <Header />
                {/* Header for all pages */}
                <Suspense fallback={<Loader />}>
                    <Router />
                </Suspense>
            </HashRouter>
        </>
    );
};

export default App;