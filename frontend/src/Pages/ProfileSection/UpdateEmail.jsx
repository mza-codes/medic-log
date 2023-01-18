import useAuthService from "../../Services/AuthService";
import VerifyFormik from '../AuthSection/VerifyFormik';
import { Dialog, DialogContent, DialogTitle } from '@mui/material';
import Icon from '../../Components/Icon';
import { emailSchema } from '../../Schema';
import { useNavigate } from "react-router-dom";

function UpdateEmail({ controls }) {
    const route = useNavigate();
    const [open, setOpen] = controls;
    const error = useAuthService(s => s.error);
    const loading = useAuthService(s => s.isLoading);
    const info = useAuthService(s => s.info);
    const generateOtp = useAuthService(s => s.generateOtp);

    function handleClose() {
        if (window.confirm("Changes Will be Lost, Continue ?")) {
            return setOpen(false);
        };
    };

    async function handleEmailSubmit(values, actions) {
        const result = await generateOtp(values);
        if (result?.success) {
            route("/enter-otp", { state: "email-update" });
        }; return;
    };

    const emailProp = {
        handleSubmit: handleEmailSubmit,
        fields: [{
            label: "E Mail",
            type: "email",
            name: "email",
            placeholder: "Enter New E Mail"
        }],
        schema: emailSchema,
        initialValues: {
            email: "",
        },
        error,
        loading
    };

    console.log({ error, loading, info });
    return (
        <Dialog open={open}>
            <DialogTitle align='center' className='relative'>
                <span className='text-3xl mb-8 font-semibold text-center font-poppins'>Update EMail</span>
                <Icon icon='eva:close-square-fill' classes='absolute right-2 top-2'
                    size={28} color="red" label="Close Dialog" onClick={handleClose} />
            </DialogTitle>

            <DialogContent>
                <section className='bg-white rounded-lg flex flex-col items-center p-8 bg-opacity-50'>
                    <VerifyFormik controllers={emailProp} />
                    <p className="text-teal-900 mt-4">{info?.message}</p>
                    <span onClick={() => { }}
                        className="text-lime-500 hover:text-lime-800 font-medium">
                        Already have OTP ?
                    </span>
                </section>
            </DialogContent>
        </Dialog>
    );
};

export default UpdateEmail;