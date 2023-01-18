import { otpSchema } from "../../Schema";
import useAuthService from "../../Services/AuthService";
import VerifyFormik from "../AuthSection/VerifyFormik";
import BGPage from "../BGPage";

function EnterOTP() {

    const validateOtp = useAuthService(s => s.validateOtp);
    const error = useAuthService(s => s.error);
    const loading = useAuthService(s => s.isLoading);

    async function handleOTPSubmit(values, actions) {
        const data = await validateOtp(values);
        if (data.success) {
            console.warn("OTP VERIFIED, UPDATE EMAIL NOW", data);
            return false;
        } else {
            return false;
        };
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
            <VerifyFormik controllers={otpProp} />
        </BGPage>
    );
};

export default EnterOTP;