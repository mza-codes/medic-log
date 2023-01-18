import * as Yup from 'yup';
import useAuthService from "../../Services/AuthService";
import VerifyFormik from '../AuthSection/VerifyFormik';
import { Dialog, DialogContent, DialogTitle } from '@mui/material';
import Icon from '../../Components/Icon';

const schema = Yup.object().shape({
    currentPassword: Yup.string().min(6).max(19).required(),
    password: Yup.string().min(6).max(19).required(),
    confirmPassword: Yup.string().required().equals([Yup.ref("password")], "Passwords Must Match")
});

function UpdatePwdWAuth({ actions }) {
    const { open, setOpen } = actions;
    const updatePwdWAuth = useAuthService(s => s.updatePwdWAuth);
    const error = useAuthService(s => s.error);
    const loading = useAuthService(s => s.isLoading);
    const info = useAuthService(s => s.info);

    function handleClose() {
        if (window.confirm("Changes Will be Lost, Continue ?")) {
            return setOpen(false);
        };
    };

    async function handleSubmit(values, actions) {
        const result = await updatePwdWAuth(values);
        if (result) {
            setOpen(false);
        }; return;
    };

    const prop = {
        handleSubmit,
        fields: [{
            label: "Current Password",
            type: "password",
            name: "currentPassword",
            placeholder: "Current Password"
        }, {
            label: "Password",
            type: "password",
            name: "password",
            placeholder: "New Password"
        }, {
            label: "Confirm Password",
            type: "password",
            name: "confirmPassword",
            placeholder: "Confirm Password"
        }],
        schema,
        initialValues: {
            password: "",
            currentPassword: "",
            confirmPassword: ""
        },
        error,
        loading
    };

    return (
        <Dialog open={open}>
            <DialogTitle align='center' className='relative'>
                <span className='text-3xl mb-8 font-semibold text-center font-poppins'>Set New Password</span>
                <Icon icon='eva:close-square-fill' classes='absolute right-2 top-2'
                    size={28} color="red" label="Close Dialog" onClick={handleClose} />
            </DialogTitle>

            <DialogContent>
                <section className='bg-white rounded-lg flex flex-col items-center p-8 bg-opacity-50'>
                    <VerifyFormik controllers={prop} />
                    <p className="text-teal-900 mt-4">{info?.message}</p>
                </section>
            </DialogContent>
        </Dialog>
    );
};

export default UpdatePwdWAuth;