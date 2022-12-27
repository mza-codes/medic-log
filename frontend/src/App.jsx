import './index.css';
import { HashRouter } from 'react-router-dom';
import Header from './Components/Header';
import Router from './router';
import { Suspense, useEffect } from 'react';
import { atom } from 'jotai';
import Loader from './Components/Loader/Loader';
import { RTFTemplate } from './Assets';
import ErrorBar from './Components/ErrorBar';
import { useRef } from 'react';
import useAuthService from './Services/AuthService';

export const docAtom = atom({ doc: RTFTemplate, avatar: null });
export const avatarAtom = atom(null);
let fetchCompleted = false;

const App = () => {
    const errMsg = useRef();
    const verifySession = useAuthService(s => s.verifySession);
    // const refreshSession = useAuthService(s => s.refreshSession);
    // const expiration = parseInt(localStorage.getItem("expiration")) ?? null;

    useEffect(() => {
        const controller = new AbortController();

        if (!fetchCompleted) {
            verifySession(controller.signal, errMsg);
            fetchCompleted = true;
        };
        return () => controller.abort();

    }, []);

    // useEffect(() => {
    //     if (expiration !== null &&
    //         (expiration * 1000) < new Date().getTime()
    //     ) {
    //         console.warn("Expired Session,refreshign session");
    //         refreshSession();
    //     };
    // }, [expiration * 1000 < new Date().getTime()]);

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