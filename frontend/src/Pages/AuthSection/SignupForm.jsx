import { useRef } from "react";
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import CustomField from "../../Components/Input/CustomField";
import useAuthService from "../../Services/AuthService";
import { useEffect } from "react";
import Loader from "../../Components/Loader/Loader";

const SignupForm = () => {

    const submitBtn = useRef();
    const { isLoading, register, error, errActive } = useAuthService();

    console.log(error, errActive);

    const handleSubmit = async (values, actions) => {
        console.log("handling submit", actions);
        submitBtn.current.disabled = true;
        await register(values);
        console.warn("Request Complete");
        return;
    };

    const schema = Yup.object().shape({
        email: Yup.string().email().required().min(6).max(46),
        name: Yup.string().required().min(3).max(46),
        password: Yup.string().min(6).max(19).required(),
        // confirmPassword: Yup.string().required().oneOf([Yup.ref('password'), null], 'Passwords must match')
        confirmPassword: Yup.string().required().equals([Yup.ref("password")], "Passwords Must Match")
    });

    useEffect(() => {
        console.log("state Change");
        submitBtn.current.disabled = !errActive;
    }, [errActive]);

    return (
        <>
            <Formik validateOnChange
                initialValues={{ email: "", password: "", confirmPassword: "", name: "" }}
                validationSchema={schema}
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
                            {errActive && <span className="err">{error?.message} !</span>}
                        </div>
                        {(isLoading || props.isSubmitting) &&
                            <Loader />
                        }
                    </Form>
                )}
            </Formik>
        </>
    );
};

export default SignupForm;