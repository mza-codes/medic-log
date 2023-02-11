import './index.css';
import { BrowserRouter } from 'react-router-dom';
import Header from './Components/Header';
import Router from './router';
import { Suspense, useEffect } from 'react';
import ErrorBar from './Components/ErrorBar';
import { useRef } from 'react';
import useAuthService from './Services/AuthService';
import BrandLoader from './Pages/BrandLoader';
import { b64Enc_1, b64Enc_2, resIntercep, SecureAPI } from './Assets';
import CancelButton from './Components/CancelButton';
import LoadBar from './Components/LoadBar';
import Toast from './Components/Toast';
import InfoToast from './Components/InfoToast';
// let fetchCompleted = false;

const App = () => {
    const errMsg = useRef();
    const verifySession = useAuthService(s => s.verifySession);
    const fetchStatus = useRef(false);

    useEffect(() => {
        let fetchCompleted = fetchStatus.current;
        const controller = new AbortController();

        if (!fetchCompleted) {
            console.warn("VERIFIY SESSION CALL >>>");
            verifySession(controller.signal, errMsg);
            fetchCompleted = true;
        };
        return () => controller.abort();
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        return () => {
            SecureAPI.interceptors.response.eject(resIntercep);
            SecureAPI.interceptors.response.eject(b64Enc_1);
            SecureAPI.interceptors.response.eject(b64Enc_2);
        };
    }, []);

    console.count("Rendered App.JSX");
    return (
        <>
            {/* <HashRouter hashType="hashbang"> */}
            <BrowserRouter>
                <LoadBar />
                <Toast />
                <InfoToast />
                <Header />

                <Suspense fallback={<BrandLoader />}>
                    <Router />
                </Suspense>
                <div className="errorBar" ref={errMsg}>
                    <ErrorBar msg='Unable to establish connection with server !' />
                </div>
                <CancelButton />
            </BrowserRouter>
            {/* </HashRouter> */}
        </>
    );
};

export default App;