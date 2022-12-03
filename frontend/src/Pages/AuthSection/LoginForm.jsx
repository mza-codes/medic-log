import { useRef } from "react";
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import CustomField from "../../Components/Input/CustomField";
import useAuthService from "../../Services/AuthService";
import { useEffect } from "react";

const LoginForm = () => {

    const submitBtn = useRef();
    const { isLoading, login, error, errActive } = useAuthService();

    console.log(error, errActive);

    const handleSubmit = async (values, actions) => {
        console.log("handling submit", actions);
        submitBtn.current.disabled = true;
        await login(values);
        console.warn("Request Complete");
        return;
    };

    const schema = Yup.object().shape({
        email: Yup.string().email().required().min(6).max(46),
        password: Yup.string().min(6).max(19).required()
    });

    useEffect(() => {
        console.log("state Change");
        submitBtn.current.disabled = !errActive;
    }, [errActive]);

    return (
        <>
            <Formik validateOnChange
                initialValues={{ email: "", password: "" }}
                validationSchema={schema}
                validateOnBlur={true}
                onSubmit={handleSubmit}>
                {props => (
                    <Form className="form flex flex-col gap-2 items-center justify-center p-2">
                        <CustomField name="email" type="text" label="Email" />
                        <CustomField name="password" type="password" label="Password" />
                        <button ref={submitBtn} type="submit" disabled={!props.isValid}
                            className="bg-teal-800 text-white p-2 hover:bg-teal-600 disabled:bg-slate-600 disabled:text-slate-400"
                        >
                            {props.isSubmitting ? "Loading" : "Submit"}
                        </button>
                        <div className="errorFeedback text-rose-600">
                            {errActive && <span className="err">{error?.message} !</span>}
                        </div>
                        {(isLoading || props.isSubmitting) &&
                            <div className="lds-ellipsis ">
                                <div />
                                <div />
                                <div />
                                <div />
                            </div>
                        }
                    </Form>
                )}
            </Formik>
        </>
    );
};

export default LoginForm;