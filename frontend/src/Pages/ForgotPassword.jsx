import VerifyFormik from './AuthSection/VerifyFormik';
import BGPage from './BGPage';
import { Link, useNavigate } from "react-router-dom";
import useAuthService from '../Services/AuthService';
import { Dialog, DialogContent, DialogTitle } from '@mui/material';
import Icon from '../Components/Icon';
import { useState } from 'react';
import { emailSchema, otpSchema } from '../Schema';

function ForgotPassword() {
    const route = useNavigate();
    const error = useAuthService(s => s.error);
    const loading = useAuthService(s => s.isLoading);
    const info = useAuthService(s => s.info);
    const forgotPwd = useAuthService(s => s.forgotPwd);
    const verifyOTPforPwd = useAuthService(s => s.verifyOTPforPwd);
    const [open, setOpen] = useState(true);

    const handleEmailSubmit = async (values, actions) => {
        console.log("Submiting Data", values);
        const res = await forgotPwd(values);
        if (res) {
            setOpen(true);
            // route('/change-password', { state: "change-pwd" });
        }; return;
    };

    const prop = {
        handleSubmit: handleEmailSubmit,
        fields: [{
            label: "Email",
            type: "email",
            name: "email",
            placeholder: "Enter Email ID"
        }],
        schema: emailSchema,
        initialValues: { email: "" },
        error,
        loading
    };

    function handleClose() {
        if (window.confirm("OTP Required to Change Password!\nChanges May not be saved!")) {
            return setOpen(false);
        };
    };

    async function handleOTPSubmit(values, actions) {
        const result = await verifyOTPforPwd(values);
        if (result) {
            setOpen(false);
            route('/change-password', { state: "change-pwd" });
        }; return;
    };

    const otpProp = {
        handleSubmit: handleOTPSubmit,
        fields: [{
            label: "OTP",
            type: "tel",
            inputMode: "numeric",
            name: "otp",
            placeholder: "OTP",
            style: {
                letterSpacing: "1.2rem",
                fontSize: "1.3rem",
                textAlign: "center",
                fontWeight: 700
            }
        }],
        schema: otpSchema,
        initialValues: { otp: "" },
        error,
        loading
    };

    console.count("Rendered FGPass.jsx");
    return (
        <BGPage center={1} image={1}>
            <section className='bg-white rounded-lg flex flex-col items-center px-1 py-8 bg-opacity-50'>
                <h1 className='text-3xl mb-8 font-semibold'>Enter Your Email</h1>
                <VerifyFormik controllers={prop} />
                <p className="text-teal-900 mt-4">{info?.message}</p>
                <Link to="/signup" className="text-teal-600 capitalize py-1 hover:text-green-700">Signup Instead ?</Link>
            </section>
            <Dialog open={open} sx={{margin:0}} >
                <DialogTitle align='center' className='relative'>
                    <span className='text-3xl mb-8 font-semibold text-center font-poppins'>Enter OTP</span>
                    <Icon icon='eva:close-square-fill' classes='absolute right-2 top-2'
                        size={28} color="red" label="Close Dialog" onClick={handleClose} />
                </DialogTitle>

                <DialogContent>
                    <section className='bg-white rounded-lg flex flex-col items-center px-1 py-8 bg-opacity-50'>
                        <VerifyFormik controllers={otpProp} />
                        <p className="text-teal-900 mt-4">{info?.message}</p>
                        <button type="button" onClick={handleClose}
                            className="text-teal-600 capitalize py-2 my-1 hover:text-green-700">
                            Resend OTP ?
                        </button>
                    </section>
                </DialogContent>
            </Dialog>
        </BGPage>
    );
};

export default ForgotPassword;