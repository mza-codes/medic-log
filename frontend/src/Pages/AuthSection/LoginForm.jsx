import { useRef } from "react";
import { Form, Formik } from 'formik';
import CustomField from "../../Components/Input/CustomField";
import useAuthService from "../../Services/AuthService";
import { useNavigate } from "react-router-dom";
import Loader from "../../Components/Loader/Loader";
import { loginSchema } from "../../Schema";

const LoginForm = () => {
    const submitBtn = useRef();
    const navigate = useNavigate();
    const { isLoading, login, error, errActive, errSource,info } = useAuthService();

    const handleSubmit = async (values, actions) => {
        submitBtn.current.disabled = true;

        const status = await login(values);
        if (status?.success) return navigate('/dashboard');

        submitBtn.current.disabled = !true;
        return;
    };

    return (
        <Formik validateOnChange
            initialValues={{ email: "", password: "" }}
            validationSchema={loginSchema}
            validateOnBlur={true}
            onSubmit={handleSubmit}>
            {props => (
                <Form className="form flex flex-col gap-2 items-center justify-center p-2 mb-10">
                    <CustomField name="email" type="text" placeholder="abc@ttof.com" label="Email" />
                    <CustomField name="password" type="password" placeholder="Password" label="Password" />
                    <button ref={submitBtn} type="submit" disabled={!props.isValid}
                        className="bg-teal-800 text-white p-2 hover:bg-teal-600 disabled:bg-slate-600 disabled:text-slate-400"
                    >
                        {props.isSubmitting ? "Loading" : "Submit"}
                    </button>
                    <div className="errorFeedback text-rose-600">
                        {(errActive && errSource === "login") && <span className="err">{error?.message ?? error?.error} </span>}
                    </div>
                    <span className="text-green-900 font-semibold">{info?.message}</span>
                    {(isLoading || props.isSubmitting) &&
                        <Loader />
                    }
                </Form>
            )}
        </Formik>
    );
};

export default LoginForm;