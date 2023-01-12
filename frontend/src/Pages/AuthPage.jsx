import { lazy, Suspense } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Icon from '../Components/Icon';
import Loader from '../Components/Loader/Loader';
import useAuthService from '../Services/AuthService';
import BGPage from './BGPage';

const LoginForm = lazy(() => import('./AuthSection/LoginForm'));
const SignupForm = lazy(() => import('./AuthSection/SignupForm'));
const Verify = lazy(() => import('./AuthSection/Verify'));

function AuthPage({ login, signup, verify }) {
  const route = useNavigate();
  const loginUser = useAuthService(s => s.login);

  async function handleDemoView() {
    if (process.env.REACT_APP_DEMO_USER
      && process.env.REACT_APP_DEMO_PWD) {
      const status = await loginUser({
        email: process.env.REACT_APP_DEMO_USER,
        password: process.env.REACT_APP_DEMO_PWD
      });
      status?.success && route('/dashboard', { replace: true });
      return;
    };
    return alert("Unavailable");
  };

  console.count("Component Rendered");
  return (
    <BGPage image={1}>

      <section className='w-full min-h-[90vh] flex flex-col items-center justify-center relative'>
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

        {login && <Icon onClick={handleDemoView}
          icon="ri:admin-fill" color="#00583b" size={36}
          label="Browse as Guest" classes='absolute right-2 top-2' />}

      </section>

    </BGPage>
  );
};

export default AuthPage;