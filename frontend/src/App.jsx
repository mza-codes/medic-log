import './index.css';
import { HashRouter } from 'react-router-dom';
import Header from './Components/Header';
import Router from './router';
import { Suspense, useEffect } from 'react';
import ErrorBar from './Components/ErrorBar';
import { useRef } from 'react';
import useAuthService from './Services/AuthService';
import BrandLoader from './Pages/BrandLoader';
import { resIntercep, SecureAPI } from './Assets';
import CancelButton from './Components/CancelButton';
import LoadBar from './Components/LoadBar';

let fetchCompleted = false;

const App = () => {
    const errMsg = useRef();
    const verifySession = useAuthService(s => s.verifySession);

    useEffect(() => {
        const controller = new AbortController();

        if (!fetchCompleted) {
            verifySession(controller.signal, errMsg);
            fetchCompleted = true;
        };
        return () => controller.abort();

    }, []);

    useEffect(() => {
        return () => SecureAPI.interceptors.response.eject(resIntercep);
    }, []);

    console.count("Rendered App.JSX");
    return (
        <>
            <HashRouter hashType="hashbang">
                <LoadBar />
                <Header />

                <Suspense fallback={<BrandLoader />}>
                    <Router />
                </Suspense>
                <div className="errorBar" ref={errMsg}>
                    <ErrorBar msg='Unable to establish connection with server !' />
                </div>
                <CancelButton />

            </HashRouter>
        </>
    );
};

export default App;