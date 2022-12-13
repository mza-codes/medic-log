import { Form, Formik } from "formik";
import { lazy, Suspense } from "react";
import styled from 'styled-components';
import * as Yup from 'yup';
import CustomField from "../Input/CustomField";
import Loader from "../Loader/Loader";
// import RTF from "./RichTextEditor";

const RTF = lazy(() => import("./RichTextEditor"));

const Stack = styled.div`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    text-align: center;
    gap: 0.5rem;
`;

const AddData = () => {

    const RequiredMsg = "Required Field !";
    const formSchema = Yup.object().shape({
        name: Yup.string().required(RequiredMsg).min(3).max(34),
        age: Yup.number().required(RequiredMsg).min(1, "Minimum Age is 1").max(120, "Invalid Age"),
        city: Yup.string().required(RequiredMsg).min(3).max(70),
        lastCheckup: Yup.date().required(RequiredMsg).max(new Date(), "Invalid Date !"),
    });

    const handleSubmit = (values, actions) => {
        console.log("Handling Submit", values);
        setTimeout(() => {
            actions.setSubmitting(false);
            return true;
        }, 6000);
    };

    const handleCancel = (clearForm) => {
        // Add Request aborter here 
        clearForm();
        return true;
    };

    const initialValues = {
        "name": "",
        "age": "",
        "city": "",
        "lastCheckup": ""
    };

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={formSchema}
            onSubmit={handleSubmit} >
            {props => (
                <Form className="flex flex-col items-center justify-center text-center gap-3 p-4">
                    <Stack>
                        <CustomField placeholder="Enter Name" type="text" label="Name" name="name" />
                        <CustomField placeholder="Enter Age" type="number" label="Age" name="age" />
                    </Stack>
                    <Stack>
                        <CustomField placeholder="Enter City" type="text" label="City" name="city" />
                        <CustomField label="Checkup Date" name="lastCheckup" placeholder="Enter Checkup Date" type="datetime-local" />
                    </Stack>

                    <Suspense fallback={<Loader />}>
                        <RTF />
                    </Suspense>

                    <Stack>
                        <button type="button" onClick={e => handleCancel(props.resetForm)} title="Reset Form"
                            className="bg-rose-400 hover:bg-rose-700 text-white rounded-md p-1">
                            <iconify-icon icon="pajamas:clear-all" width="auto" height="auto" />
                        </button>

                        <button type="submit" title="Submit Form" disabled={!props.isValid || props.isSubmitting}
                            className="bg-teal-700 hover:bg-teal-400 p-2 text-white rounded-md disabled:bg-slate-600">
                            {props.isSubmitting ? "Loading" : "Submit"}
                        </button>
                    </Stack>
                    {props.isSubmitting && <Loader inline={1} />}
                </Form>
            )}
        </Formik>
    );
};

export default AddData;

// const pattern = /(^[A-Za-z]{3,16})([ ]{0,1})([A-Za-z]{3,16})?([ ]{0,1})?([A-Za-z]{3,16})?([ ]{0,1})?([A-Za-z]{3,16})/; 
// fullname validation using regex use if necessary, do test before deploy // 
// syntax for test .test('isValid', value => pattern.test(value))
