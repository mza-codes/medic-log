import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import useAuthService from "../Services/AuthService";
import BGPage from "./BGPage";
import VerifyFormik from "./AuthSection/VerifyFormik";

function ChangePwd() {

    const route = useNavigate();
    const error = useAuthService(s => s.error);
    const loading = useAuthService(s => s.isLoading);
    const info = useAuthService(s => s.info);
    const updatePassword = useAuthService(s => s.updatePassword);

    async function handleSubmit(values, actions) {
        const res = await updatePassword(values);
        if (res) {
            route('/login', { replace: true });
        }; return;
    };

    const schema = Yup.object().shape({
        password: Yup.string().min(6).max(19).required(),
        confirmPassword: Yup.string().required().oneOf([Yup.ref('password'), null], 'Passwords must match')
    });

    const prop = {
        handleSubmit,
        fields: [{
            label: "Password",
            type: "password",
            name: "password",
            placeholder: "Enter password"
        }, {
            label: "Password",
            type: "password",
            name: "confirmPassword",
            placeholder: "Enter Confirm Password"
        }],
        schema,
        initialValues: {
            password: "",
            confirmPassword: ""
        },
        error,
        loading
    };

    return (
        <BGPage center={1} image={1}>
            <section className='bg-white rounded-lg flex flex-col items-center p-8 bg-opacity-50'>
                <h1 className='text-3xl mb-8 font-semibold'>Set New Password</h1>
                <VerifyFormik controllers={prop} />
                <p className="text-emerald-900 mt-4 font-semibold">{info?.message}</p>
                <Link to="/signup" className="text-teal-600 capitalize py-1 hover:text-green-700">Signup Instead ?</Link>
            </section>
        </BGPage>
    );
};

export default ChangePwd;