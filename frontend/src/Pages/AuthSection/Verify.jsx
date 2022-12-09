import { useRef } from "react";
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
    const { errActive, error, errSource } = useAuthService();

    console.log("Prinitng info", { error, errSource, errActive });

    const handleVerification = async (e) => {
        e.preventDefault();
        submitBtn.current.disabled = true;
        const otp = otpField.current.value;

        const data = await validateOtp({ otp });
        console.warn("Req Complete");
        if (data.success) {
            const info = await register();
            if (info.success) return navigate("/dashboard");
            else return false;
        } else {
            submitBtn.current.disabled = false;
            return false;
        };
    };

    return (
        <form className="min-w-[280px] sm:min-w-[340px] max-w-[500px] bg-white  rounded-xl
                flex flex-col text-start gap-3 py-4 px-6 mb-40" onSubmit={handleVerification}>
            <h3 className="text-2xl font-medium py-2 text-emerald-900">Verification </h3>

            <input type="tel" placeholder="Enter Verification Code" ref={otpField} id="otpField"
                required minLength={3} maxLength={7}
                className="p-2 rounded-md outline-none border-2 border-slate-400 focus:border-slate-700 appearance-none" />
            <button type="submit" className="bg-emerald-200 hover:bg-emerald-500 hover:text-white
                 disabled:bg-slate-400 disabled:hover:bg-slate-400
                    p-2 w-fit rounded-sm text-gray-800" ref={submitBtn} >
                {isLoading ? "Loading" : "Submit"}
            </button>

            <p className="text-teal-600">{info?.message}</p>
            {(errActive && errSource === "verify") && <p className="text-rose-500">{error?.message ?? error?.error}</p>}

            <Link to="/" state={{ disableError: true }} className=' text-emerald-500 hover:text-emerald-800 mb-2'>
                Have'nt Receieved Verification Code ?
            </Link>
            {isLoading && <Loader inline={0} />}
        </form>
    );
};

export default Verify;