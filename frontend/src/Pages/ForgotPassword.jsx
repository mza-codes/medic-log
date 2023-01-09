import { Loader } from '@mantine/core';
import { Link } from 'react-router-dom';
import BGPage from './BGPage';

function ForgotPassword() {

    const isLoading = false;
    const errActive = true;
    const error = {};
    const info = {};

    const handleSubmit = () => {
        return true;
    };

    return (
        <BGPage center={1} image={1}>
            <form className="min-w-[280px] sm:min-w-[340px] max-w-[500px] bg-white  rounded-xl
                flex flex-col text-start gap-3 py-4 px-6 mb-40" onSubmit={handleSubmit}>
                <h3 className="text-2xl font-medium py-2 text-emerald-900">Enter Email ID</h3>

                <input type="email" placeholder="Enter Email" id="otpField" required minLength={4} maxLength={26}
                    className="p-2 rounded-md outline-none border-2 border-slate-400 focus:border-slate-700 appearance-none" />

                <button type="submit" className="bg-emerald-800 hover:bg-emerald-700 text-white
                 disabled:bg-slate-400 disabled:hover:bg-slate-400 disabled:text-slate-800 p-2 w-fit rounded-sm"
                    disabled={isLoading} >
                    {isLoading ? "Loading" : "Submit"}
                </button>

                <p className="text-teal-600 capitalize">{info?.message}</p>
                {errActive && <p className="text-rose-500 capitalize">{error?.message ?? error?.error}</p>}

                <Link to="/login" state={{ disableError: true }} className=' text-emerald-500 hover:text-emerald-800 mb-2'>
                    Proceed to Login
                </Link>
                {isLoading && <Loader size={40} color="teal" />}
                
            </form>
        </BGPage>
    );
};

export default ForgotPassword;