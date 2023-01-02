import './index.css';
import { HashRouter } from 'react-router-dom';
import Header from './Components/Header';
import Router from './router';
import { Suspense, useEffect } from 'react';
import Loader from './Components/Loader/Loader';
import ErrorBar from './Components/ErrorBar';
import { useRef } from 'react';
import useAuthService from './Services/AuthService';

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

    console.count("Rendered App.JSX");
    return (
        <>
            <HashRouter hashType="hashbang">
                <Header />

                <Suspense fallback={<Loader />}>
                    <Router />
                </Suspense>
                <div className="errorBar" ref={errMsg}>
                    <ErrorBar msg='Unable to establish connection with server !' />
                </div>
            </HashRouter>
        </>
    );
};

export default App;