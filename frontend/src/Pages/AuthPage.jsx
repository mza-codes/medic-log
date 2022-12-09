import { lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import bg from '../Assets/bg-small.jpg';
import Loader from '../Components/Loader/Loader';
import useAuthService from '../Services/AuthService';
import Verify from './AuthSection/Verify';

const LoginForm = lazy(() => import('./AuthSection/LoginForm'));
const SignupForm = lazy(() => import('./AuthSection/SignupForm'));

const AuthPage = ({ login, signup, verify }) => {
  const cancelReq = useAuthService(state => state.cancelReq);
  const isLoading = useAuthService(state => state.isLoading);
  // const message = useRef();
  console.count("Component Rendered");

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

      </section>

      <section className='w-full absolute bottom-1 h-[50px] flex items-center justify-center'>
        {isLoading &&
          <button type='button' onClick={cancelReq} className='fixed right-1 hover:bg-red-700 text-white rounded-md p-1 bg-teal-700'>
            Cancel
          </button>}
        {/* {isCancelled.length !==0 && <>
          <p ref={message} className='text-gray-800 text-center'>{isCancelled}</p>
          <button type='button' onClick={disableBar} className='fixed left-1 text-red-600 rounded-xl p-2'>
            <iconify-icon icon="eva:close-circle-fill" width={33} height={33} />
          </button>
        </>} */}
      </section>

    </main>
  );
};

export default AuthPage;