import { lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import Loader from '../Components/Loader/Loader';
import BGPage from './BGPage';

const LoginForm = lazy(() => import('./AuthSection/LoginForm'));
const SignupForm = lazy(() => import('./AuthSection/SignupForm'));
const Verify = lazy(() => import('./AuthSection/Verify'));

const AuthPage = ({ login, signup, verify }) => {

  console.count("Component Rendered");
  return (
    <BGPage image={1}>

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
          className='text-emerald-500 hover:text-emerald-800 font-normal' >
          {login ? "Don't" : signup && "Already"} have an Account ?
        </Link>}
        {login && <Link to="/forgot-password" className='text-teal-800 hover:text-teal-600 py-2 font-normal' >Forgot Password ?</Link>}

      </section>

    </BGPage>
  );
};

export default AuthPage;