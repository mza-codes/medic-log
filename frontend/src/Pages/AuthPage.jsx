import { Link, useNavigate } from 'react-router-dom';
import useAuthService from '../Services/AuthService';
import BGPage from './BGPage';
import LoginForm from './AuthSection/LoginForm';
import SignupForm from './AuthSection/SignupForm';
import Verify from './AuthSection/Verify';

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
    return useAuthService.getState().handleAuthError("login", {
      message: "This feature is currently Unavailable!"
    });
  };

  console.count("Component Rendered");
  return (
    <BGPage image={1}>

      <section className='w-full min-h-[90vh] flex flex-col items-center justify-center relative'>
        <h1 className='text-4xl font-semibold underline mb-8'>{login ? "Login" : signup ? "SignUp" : verify && "Verify"}</h1>
        {login && <LoginForm />}

        {signup && <SignupForm />}

        {verify && <Verify />}

        {login && <p onClick={handleDemoView}
          className='text-green-800 hover:text-green-700 cursor-pointer py-2 font-medium'>
          Guest Session ? </p>
        }

        {(login || signup) && <Link to={login ? "/signup" : signup && "/login"}
          className='text-emerald-500 hover:text-emerald-800 font-normal'>
          {login ? "Don't" : signup && "Already"} have an Account ?
        </Link>}

        {login && <Link to="/forgot-password" className='text-teal-800 hover:text-teal-600 py-2 font-normal'>
          Forgot Password ?
        </Link>}

      </section>

    </BGPage>
  );
};

export default AuthPage;