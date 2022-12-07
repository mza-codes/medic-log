import './index.css';
import { HashRouter } from 'react-router-dom';
import Header from './Components/Header';
import Router from './router';

const App = () => {

    return (
        <>
            <HashRouter hashType="hashbang">
                <Header />
                {/* Header for all pages */}
                <Router />
            </HashRouter>
        </>
    );
};

export default App;