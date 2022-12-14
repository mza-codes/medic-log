import { LoadingOverlay } from "@mantine/core";
import { Form, Formik } from "formik";
import Dropdown from "../../Components/Dropdown";
import CustomField from "../../Components/Input/CustomField";
import { userSchema } from "../../Schema";
import useAuthService from "../../Services/AuthService";

function ProfileForm({ user }) {
    // const { isLoading, error, errActive, updateProfile } = useAuthService();
    const isLoading = useAuthService(s => s.isLoading);
    const error = useAuthService(s => s.error);
    const errActive = useAuthService(s => s.errActive);
    const updateProfile = useAuthService(s => s.updateProfile);

    const initialValues = {
        email: user?.email ?? "",
        password: "",
        confirmPassword: "",
        name: user?.name ?? ""
    };

    const handleSubmit = async (values, actions) => {
        if (initialValues.name === values.name) return false;
        
        const data = await updateProfile({ name: values.name });
        data?.success && alert("OK");
        console.log("Request Complete");
        return;
    };

    return (
        <Formik validateOnChange={true} enableReinitialize={true}
            initialValues={initialValues}
            validationSchema={userSchema}
            validateOnBlur={true}
            onSubmit={handleSubmit}>
            {props => (
                <Form className="form flex flex-col gap-2 items-center justify-center p-2 mb-10">
                    <Dropdown options={["name", "password"]} />
                    <CustomField name="name" type="text" placeholder="Organization Name" label="Name" />
                    <CustomField name="email" type="text" placeholder="abc@ttof.com"
                        label="Email" readOnly={true} title="This Field is Read Only" />
                    <CustomField name="password" type="password" placeholder="Password" label="Password" />
                    <CustomField name="confirmPassword" type="password" placeholder="Confirm Password" label="Confirm Password" />
                    <button type="submit" disabled={!props.isValid}
                        className="bg-teal-800 text-white p-2 hover:bg-teal-600 disabled:bg-slate-600 disabled:text-slate-400"
                    >
                        {props.isSubmitting ? "Loading" : "Submit"}
                    </button>
                    <div id="errorFeedback" className="text-rose-600">
                        {errActive && <span className="err">{error?.message ?? error?.error} !</span>}
                    </div>

                    {isLoading && <LoadingOverlay
                        visible={true}
                        transitionDuration={500}
                        overlayColor={"#111"}
                        overlayOpacity={0.6}
                        loaderProps={{ size: 100, color: '#fff', variant: 'bars' }}
                    />}
                </Form>
            )}
        </Formik>
    );
};

export default ProfileForm;
