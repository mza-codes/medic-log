import useApiService from '../Services/APIService';
import VerifyFormik from './AuthSection/VerifyFormik';
import BGPage from './BGPage';
import * as Yup from "yup";

function ForgotPassword() {

    const error = useApiService(s => s.error);
    const loading = useApiService(s => s.isLoading);
    const info = { message: "Success" };

    const handleSubmit = (values, actions) => {
        console.log("Submiting Data", values);
        return true;
    };

    const schema = Yup.object().shape({
        email: Yup.string().email("Invalid Email Address").min(6).max(30).required()
    });

    const prop = {
        handleSubmit,
        fields: [{
            label: "Email",
            type: "email",
            name: "email",
            placeholder: "Enter Email ID"
        }],
        schema,
        initialValues: { email: "" },
        error,
        loading
    };

    return (
        <BGPage center={1} image={1}>
            <section className='bg-white rounded-lg flex flex-col items-center p-8 bg-opacity-50'>
                <h1 className='text-3xl mb-8 font-semibold'>Enter Your Email</h1>
                <VerifyFormik controllers={prop} />
                <p className="text-teal-600 capitalize mt-4">{info?.message}</p>
            </section>
        </BGPage>
    );
};

export default ForgotPassword;