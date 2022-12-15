import { Form, Formik } from "formik";
import { useNavigate } from "react-router-dom";
import styled from 'styled-components';
import * as Yup from 'yup';
import { hooker } from "../../Assets";
import useApiService, { controller } from "../../Services/APIService";
import CustomField from "../Input/CustomField";
import Loader from "../Loader/Loader";

const Stack = styled.div`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    text-align: center;
    gap: 0.5rem;
`;

const AddDataForm = () => {
    const navigate = useNavigate();
    const setPayload = hooker("setPayload", useApiService);
    const error = hooker("error", useApiService);
    const isLoading = hooker("isLoading", useApiService);
    const handleSubmission = hooker("handleSubmission", useApiService);

    const RequiredMsg = "Required Field !";
    const formSchema = Yup.object().shape({
        name: Yup.string().required(RequiredMsg).min(3).max(34),
        age: Yup.number().required(RequiredMsg).min(1, "Minimum Age is 1").max(120, "Invalid Age"),
        city: Yup.string().required(RequiredMsg).min(3).max(70),
        lastCheckup: Yup.date().required(RequiredMsg).max(new Date(), "Invalid Date !"),
    });

    const handleSubmit = async (values, actions) => {
        console.log("Handling Submit", actions);
        const isValid = await setPayload(values);
        if (isValid) {
            const status = await handleSubmission();
            if (status) {
                actions?.resetForm();
                return navigate('/');
            };
        };
        actions.setSubmitting(false);
        return isValid;
    };

    const clearForm = (clearData) => {
        // Add Request aborter here
        clearData();
        controller?.abort("User Cancelled");
        return true;
    };

    const initialValues = {
        "name": "",
        "age": "",
        "city": "",
        "lastCheckup": ""
    };

    console.count("AddData Formik rendered");
    return (
        <Formik
            initialValues={initialValues}
            validationSchema={formSchema}
            onSubmit={handleSubmit} >
            {props => (
                <Form className="flex flex-col items-center justify-center gap-3 p-4">
                    <Stack>
                        <CustomField placeholder="Enter Name" type="text" label="Name" name="name" />
                        <CustomField placeholder="Enter Age" type="number" label="Age" name="age" />
                    </Stack>
                    <Stack>
                        <CustomField placeholder="Enter City" type="text" label="City" name="city" />
                        <CustomField label="Checkup Date" name="lastCheckup" placeholder="Enter Checkup Date" type="datetime-local" />
                    </Stack>

                    <Stack>
                        <button type="button" onClick={e => clearForm(props.resetForm)} title="Reset Form"
                            className="bg-rose-400 hover:bg-rose-700 text-white rounded-md p-1">
                            <iconify-icon icon="pajamas:clear-all" width="auto" height="auto" />
                        </button>

                        <button type="submit" title="Submit Form" disabled={!props.isValid || props.isSubmitting || isLoading}
                            className="bg-teal-700 hover:bg-teal-400 p-2 text-white rounded-md disabled:bg-slate-600">
                            {(props.isSubmitting || isLoading) ? "Loading" : "Submit"}
                        </button>
                    </Stack>
                    {(props.isSubmitting || isLoading) && <Loader inline={1} />}
                    {error?.active && <p className="text-red-500">{error?.message || error?.code}</p>}
                </Form>
            )}
        </Formik>
    );
};

export default AddDataForm;

// const pattern = /(^[A-Za-z]{3,16})([ ]{0,1})([A-Za-z]{3,16})?([ ]{0,1})?([A-Za-z]{3,16})?([ ]{0,1})?([A-Za-z]{3,16})/; 
// fullname validation using regex use if necessary, do test before deploy // 
// syntax for test .test('isValid', value => pattern.test(value))
