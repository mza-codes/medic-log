import { useRef } from "react";
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import CustomField from "../../Components/Input/CustomField";
import useAuthService from "../../Services/AuthService";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "../../Components/Loader/Loader";

const LoginForm = () => {
    const submitBtn = useRef();
    const navigate = useNavigate();
    const { isLoading, login, error, errActive, errSource } = useAuthService();

    const handleSubmit = async (values, actions) => {
        submitBtn.current.disabled = true;
        const status = await login(values);
        if (status?.success) return navigate('/dashboard');
        else return false;
    };

    const schema = Yup.object().shape({
        email: Yup.string().email().required().min(6).max(46),
        password: Yup.string().min(6).max(19).required()
    });

    useEffect(() => {
        submitBtn.current.disabled = !errActive;
    }, [errActive]);

    return (
        <Formik validateOnChange
            initialValues={{ email: "", password: "" }}
            validationSchema={schema}
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
                        {(errActive && errSource === "login") && <span className="err">{error?.message ?? error?.error} !</span>}
                    </div>
                    {(isLoading || props.isSubmitting) &&
                        <Loader />
                    }
                </Form>
            )}
        </Formik>
    );
};

export default LoginForm;