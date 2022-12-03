import { useRef } from "react";
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import CustomField from "../../Components/Input/CustomField";
import useAuthService from "../../Services/AuthService";

const LoginForm = () => {

    const submitBtn = useRef();
    const { isLoading } = useAuthService();

    const handleSubmit = () => {
        console.log("handling submit");
    };

    const schema = Yup.object().shape({
        email: Yup.string().email().required().min(6).max(46),
        password: Yup.string().min(6).max(19).required()
    });

    return (
        <>
            <Formik
                initialValues={{ email: "", password: "" }}
                validationSchema={schema}
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