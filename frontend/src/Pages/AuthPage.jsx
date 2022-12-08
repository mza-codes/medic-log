import { lazy, Suspense, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import bg from '../Assets/bg-small.jpg';
import Loader from '../Components/Loader/Loader';
import useAuthService from '../Services/AuthService';
import Verify from './AuthSection/Verify';

const AuthPage = ({ login, signup, verify }) => {
  const LoginForm = lazy(() => import('./AuthSection/LoginForm'));
  const SignupForm = lazy(() => import('./AuthSection/SignupForm'));
  const hideError = useAuthService(state => state.hideError);

  useEffect(() => {
    hideError();
  }, []);

  return (
    <main style={{ backgroundImage: `url(${bg})` }} className='w-full min-h-[94vh] bg-cover'>

      <section className='w-full min-h-[90vh] flex flex-col items-center justify-center'>
        <h1 className='text-4xl font-semibold underline mb-8'>{login ? "Login" : signup ? "SignUp" : verify && "Verify"}</h1>
        {login &&
          <Suspense fallback={<Loader />}>
            <LoginForm />
          </Suspense>}

        {signup &&
          <Suspense fallback={<Loader />}>
            <SignupForm />
          </Suspense>}

        {verify &&
          <Suspense fallback={<Loader />}>
            <Verify />
          </Suspense>}

        {(login ?? signup) && <Link to={login ? "/signup" : signup && "/login"}
          className='text-emerald-500 hover:text-emerald-800' >
          {login ? "Don't" : signup && "Already"} have an Account ?
        </Link>}

        {/* {verify &&
          <Link to="/" className='text-emerald-500 hover:text-emerald-800' >Have'nt Receieved Verification Code ?</Link>
        } */}
      </section>

    </main>
  );
};

export default AuthPage;