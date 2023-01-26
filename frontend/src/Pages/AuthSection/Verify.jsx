import { useRef } from "react";
import shallow from "zustand/shallow";
import { Link, useNavigate } from "react-router-dom";
import Loader from '../../Components/Loader/Loader';
import useAuthService from "../../Services/AuthService";

const Verify = () => {
    const submitBtn = useRef();
    const otpField = useRef();
    const navigate = useNavigate();
    const info = useAuthService((state) => state.info);
    const validateOtp = useAuthService((state) => state.validateOtp);
    const isLoading = useAuthService((state) => state.isLoading);
    const register = useAuthService((state) => state.register);
    const resendOtp = useAuthService(s => s.resendOtp);
    const [errActive, error, errSource] = useAuthService(s => ([s.errAcrive, s.error, s.errSource]), shallow);

    const handleVerification = async (e) => {
        e.preventDefault();
        submitBtn.current.disabled = true;
        const otp = otpField.current.value;

        const data = await validateOtp({ otp });
        console.warn("Req Complete");
        if (data.success) {
            let info = await register();
            if (info.success) return navigate("/dashboard");
            else return false;
        } else {
            submitBtn.current.disabled = false;
            return false;
        };
    };
    console.log({ errActive, errSource, error });
    return (
        <form className="min-w-[280px] sm:min-w-[340px] max-w-[500px] bg-white  rounded-xl
                flex flex-col text-start gap-3 py-4 px-6 mb-40" onSubmit={handleVerification}>
            <h3 className="text-2xl font-medium py-2 text-emerald-900">Verification </h3>

            <input type="text" placeholder="Enter Verification Code" ref={otpField} id="otpField"
                inputMode="numeric" pattern="\d*" required minLength={3} maxLength={7}
                className="p-2 rounded-md outline-none border-2 border-slate-400 focus:border-slate-700 appearance-none" />
            <button type="submit" className="bg-emerald-200 hover:bg-emerald-500 hover:text-white
                 disabled:bg-slate-400 disabled:hover:bg-slate-400
                    p-2 w-fit rounded-sm text-gray-800" ref={submitBtn} >
                {isLoading ? "Loading" : "Submit"}
            </button>

            <p className="text-teal-600 capitalize">{info?.message}</p>
            {(errSource === "verify") &&
                <p className="text-rose-500 capitalize">{error?.message ?? error?.error}</p>
            }

            <button type="button" onClick={resendOtp} className=' text-emerald-500 text-start hover:text-emerald-800 mb-2'>
                Have'nt Receieved Verification Code ?
            </button>
            <Link to="/signup" className=' text-green-600 hover:text-emerald-800' >Signup ?</Link>
            {isLoading && <Loader inline={0} />}
        </form>
    );
};

export default Verify;