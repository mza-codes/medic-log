import { otpSchema } from "../../Schema";
import useAuthService from "../../Services/AuthService";
import VerifyFormik from "../AuthSection/VerifyFormik";
import BGPage from "../BGPage";
import { useNavigate } from "react-router-dom";

function EnterOTP() {
    const route = useNavigate();
    const validateOtp = useAuthService(s => s.validateOtp);
    const error = useAuthService(s => s.error);
    const loading = useAuthService(s => s.isLoading);
    const info = useAuthService(s => s.info);
    const resendOtp = useAuthService(s => s.resendOtp);
    const updateProfile = useAuthService(s => s.updateProfile);
    const email = useAuthService(s => s.userData?.email);

    async function handleOTPSubmit(values, actions) {
        const data = await validateOtp(values);
        if (data.success) {
            const res = updateProfile({ email });
            if (res) return route('/');
        }; return false;
    };
    const otpProp = {
        handleSubmit: handleOTPSubmit,
        fields: [{
            label: "OTP",
            type: "tel",
            inputMode: "numeric",
            name: "otp",
            placeholder: "OTP",
            style: {
                letterSpacing: "1.2rem",
                fontSize: "1.3rem",
                textAlign: "center",
                appearance: "none !important",
                WebkitAppearance: "none !important",
                fontWeight: 700
            }
        }],
        schema: otpSchema,
        initialValues: { otp: "" },
        error,
        loading
    };

    return (
        <BGPage center={1} image={1}>
            <section className='bg-white rounded-lg flex flex-col items-center px-2 py-8 bg-opacity-50'>
                <h1 className='text-3xl mb-8 font-semibold'>Enter OTP</h1>
                <VerifyFormik controllers={otpProp} />
                <p className="text-emerald-900 mt-4 font-semibold">{info?.message}</p>
                <button type="button" onClick={resendOtp}
                    className="text-teal-600 capitalize py-1 hover:text-green-700">Resend OTP ?
                </button>
            </section>
        </BGPage>
    );
};

export default EnterOTP;