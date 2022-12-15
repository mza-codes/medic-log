import './index.css';
import { HashRouter } from 'react-router-dom';
import Header from './Components/Header';
import Router from './router';
import { Suspense } from 'react';
import { atom } from 'jotai';
import Loader from './Components/Loader/Loader';
import { RTFTemplate } from './Assets';

export const docAtom = atom({ doc: RTFTemplate, avatar: null });

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