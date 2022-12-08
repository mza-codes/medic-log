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
    const { errActive, error, errSource } = useAuthService();

    console.log(errActive, error, "\n Error UP");

    const handleVerification = async () => {
        submitBtn.current.disabled = true;
        const otp = otpField.current.value;
        const data = await validateOtp({ otp });
        console.warn("Req Complete");
        if (data.success) {
            navigate("/dashboard");
            return true;
        } else {
            submitBtn.current.disabled = false;
            return false;
        };
    };

    return (
        <main className="min-w-[280px] sm:min-w-[340px] min-h-fit bg-white  rounded-xl
                flex flex-col text-start gap-3 py-4 px-6 mb-[10%]">
            <h3 className="text-2xl font-medium py-2 text-emerald-900">Verification </h3>

            <input type="number" placeholder="Enter Verification Code" ref={otpField} maxLength={8}
                className="p-2 rounded-md outline-none border-2 border-slate-400 focus:border-slate-700" />
            <button type="button" className="bg-emerald-200 hover:bg-emerald-500 hover:text-white
                 disabled:bg-slate-400 disabled:hover:bg-slate-400
                    p-2 w-fit rounded-sm text-gray-800" ref={submitBtn} onClick={handleVerification} >
                {isLoading ? "Loading" : "Submit"}
            </button>

            <p className="text-teal-600 whitespace-pre-line">{info?.message}</p>
            {(errActive && errSource === "verify") && <p className="text-rose-500">{error?.message ?? error?.error}</p>}
            <Link to="/" state={{ disableError: true }} className=' text-emerald-500 hover:text-emerald-800 mb-2'>
                Have'nt Receieved Verification Code ?
            </Link>
            {isLoading && <Loader inline={0} />}
        </main>
    );
};

export default Verify;