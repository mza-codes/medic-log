import { useRef } from "react";
import shallow from "zustand/shallow";
import { Form, Formik } from 'formik';
import CustomField from "../../Components/Input/CustomField";
import useAuthService from "../../Services/AuthService";
import { useEffect } from "react";
import Loader from "../../Components/Loader/Loader";
import { useNavigate } from "react-router-dom";
import { userSchema } from "../../Schema";

const SignupForm = () => {
    const navigate = useNavigate();
    const submitBtn = useRef();
    const [isLoading, error, errActive, errSource] =
        useAuthService(s => ([
            s.isLoading,
            s.error,
            s.errActive,
            s.errSource]), shallow);

    const generateOtp = useAuthService(s => s.generateOtp);

    const handleSubmit = async (values, actions) => {
        submitBtn.current.disabled = true;
        const data = await generateOtp(values);
        data?.success && navigate("/verify");
        console.log("Request Complete Generated OTP", data);
        return;
    };

    useEffect(() => {
        submitBtn.current.disabled = !errActive;
    }, [errActive]);

    return (
        <Formik validateOnChange
            initialValues={{ email: "", password: "", confirmPassword: "", name: "" }}
            validationSchema={userSchema}
            validateOnBlur={true}
            onSubmit={handleSubmit}>
            {props => (
                <Form className="form flex flex-col gap-2 items-center justify-center p-2 mb-10">
                    <CustomField name="name" type="text" placeholder="Organization Name" label="Name" />
                    <CustomField name="email" type="text" placeholder="abc@ttof.com" label="Email" />
                    <CustomField name="password" type="password" placeholder="Password" label="Password" />
                    <CustomField name="confirmPassword" type="password" placeholder="Confirm Password" label="Confirm Password" />
                    <button ref={submitBtn} type="submit" disabled={!props.isValid}
                        className="bg-teal-800 text-white p-2 hover:bg-teal-600 disabled:bg-slate-600 disabled:text-slate-400"
                    >
                        {props.isSubmitting ? "Loading" : "Submit"}
                    </button>
                    <div id="errorFeedback" className="text-rose-600">
                        {(errActive && errSource === "signup") && <span className="err">{error?.message ?? error?.error} !</span>}
                    </div>
                    {(isLoading || props.isSubmitting) &&
                        <Loader />
                    }
                </Form>
            )}
        </Formik>
    );
};

export default SignupForm;