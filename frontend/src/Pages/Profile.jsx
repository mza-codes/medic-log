import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import useAuthService from "../Services/AuthService";
import BGPage from "./BGPage";
import VerifyFormik from "./AuthSection/VerifyFormik";
import UpdatePwdWAuth from "./AuthSection/UpdatePwdWAuth";
import { useState } from "react";

function Profile() {
    const route = useNavigate();
    const [open, setOpen] = useState(false);
    const user = useAuthService(s => s.user);
    const error = useAuthService(s => s.error);
    const loading = useAuthService(s => s.isLoading);
    const info = useAuthService(s => s.info);
    const updateProfile = useAuthService(s => s.updateProfile);

    const handleSubmit = async (values, actions) => {
        console.log(actions); console.log(values);
        if (initialValues.name === values.name) {
            actions.setErrors({ name: "Name is Already Same" });
            return false;
        };
        const data = await updateProfile({ name: values.name });
        data &&  route('/dashboard', { replace: true });
        return;
    };

    function openDialog() {
        return setOpen(true);
    };

    const initialValues = {
        email: user?.email ?? "",
        name: user?.name ?? ""
    };

    const schema = Yup.object().shape({
        email: Yup.string().email().required(),
        name: Yup.string().min(3).max(46),
    });

    const prop = {
        handleSubmit,
        fields: [{
            label: "Email",
            type: "email",
            name: "email",
            placeholder: "Enter E Mail",
            readOnly: true,
            title: "This Field is Read Only"
        }, {
            label: "User Name",
            type: "text",
            name: "name",
            placeholder: "Enter User Name"
        }],
        schema,
        initialValues,
        error,
        loading
    };

    return (
        <BGPage center={1} image={1}>
            <section className='bg-white rounded-lg flex flex-col items-center p-8 bg-opacity-50'>
                <h1 className='text-3xl mb-8 font-semibold'>Update Profile</h1>
                <VerifyFormik controllers={prop} />
                <p className="text-emerald-900 mt-4 font-semibold">{info?.message}</p>
                <button type="button" onClick={openDialog}
                    className="text-teal-600 capitalize py-1 hover:text-green-700">Change Password ?
                </button>
                <main className="dialogPwd hidden">
                    <UpdatePwdWAuth actions={{ open, setOpen }} />
                </main>
            </section>
        </BGPage>
    );
};

export default Profile;