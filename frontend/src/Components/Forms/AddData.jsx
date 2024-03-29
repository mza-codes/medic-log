import { Tooltip } from "@mantine/core";
import { Form, Formik } from "formik";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from 'styled-components';
import * as Yup from 'yup';
import useApiService, { controller } from "../../Services/APIService";
import useLocalState from "../../Services/LocalState";
import { hook } from "../../Utils";
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

const AddDataForm = ({ data, update }) => {
    const navigate = useNavigate();
    const setPayload = hook("setPayload", useApiService);
    const error = hook("error", useApiService);
    const isLoading = hook("isLoading", useApiService);
    const handleSubmission = hook("handleSubmission", useApiService);
    const setState = useLocalState(s => s.setPersonData);
    const setDocument = useApiService(s => s.setDocument);

    const RequiredMsg = "Required Field !";
    const formSchema = Yup.object().shape({
        name: Yup.string().required(RequiredMsg).min(3).max(34),
        age: Yup.number().required(RequiredMsg).min(1, "Minimum Age is 1").max(120, "Invalid Age")
            .positive("Must be Greater than 0").integer(),
        city: Yup.string().required(RequiredMsg).min(3).max(70),
        lastCheckup: Yup.date().required(RequiredMsg).max(new Date(), "Invalid Date !")
            .min(new Date("1970-01-01T00:00"), "Too Old Date"),
    });

    const handleSubmit = async (values, actions) => {
        const isValid = await setPayload(values);
        if (isValid) {
            let status;
            if (update === 1) status = await handleSubmission(update, data?._id);
            else status = await handleSubmission();

            if (status === true) {
                actions?.resetForm();
                setDocument(" ");
                return navigate('/');
            };
        };
        actions.setSubmitting(false);
        return isValid;
    };

    const clearForm = (clearData) => {
        clearData();
        controller?.abort("User Cancelled");
        return true;
    };

    const initialValues = {
        "name": data?.name ?? "",
        "age": data?.age ?? "",
        "city": data?.city ?? "",
        "lastCheckup": data?.lastCheckup?.[0] ?? ""
    };

    const fillDoc = (data) => {
        const { name, age, lastCheckup, city } = data;
        setState(
            `<h2 style="text-align: justify">${name}</h2><p style="text-align: justify"><strong>Place: ${city}</strong></p><p style="text-align: justify"><strong>Age: ${age}</strong></p><p style="text-align: justify"><strong>Last Checkup: ${new Date(lastCheckup).toLocaleDateString()}</strong></p>`
        );
        return true;
    };

    useEffect(() => {
        return () => setDocument(" ");
    }, []);

    console.warn({
        setPayload,
        error,
        isLoading,
        handleSubmission,
        setState,
        setDocument
    });
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
                        <Tooltip label={"Reset Form"} color={"#ff633c"} withArrow={true} >
                            <button type="button" onClick={e => clearForm(props.resetForm)} title="Reset Form"
                                className="bg-rose-400 hover:bg-rose-700 text-white rounded-md py-1 px-2">
                                <iconify-icon icon="pajamas:clear-all" width="auto" height="auto" />
                            </button>
                        </Tooltip>
                        <button type="submit" title="Submit Form" disabled={!props.isValid || props.isSubmitting || isLoading}
                            className="bg-teal-700 hover:bg-teal-600 p-2 text-white rounded-md disabled:bg-slate-600">
                            {(props.isSubmitting || isLoading) ? "Loading" : "Submit"}
                        </button>

                        <Tooltip label={"Fill Document With FormData"} color={"#00b16d"} withArrow={true} >
                            <button type="button" onClick={e => fillDoc(props.values)} title="Pass Form Data to Document (Beta)"
                                className="bg-amber-400 hover:bg-amber-700 text-white rounded-md py-1 px-2">
                                <iconify-icon icon="fluent:form-28-filled" width="auto" height="auto" />
                            </button>
                        </Tooltip>
                    </Stack>
                    {(props.isSubmitting || isLoading) && <Loader inline={1} />}
                    {error?.active && <p className="text-red-500 text-center max-w-[600px]">{error?.message || error?.code}</p>}
                    {<p className="text-teal-900 text-center max-w-[600px]">Please Verify How the Document Looks like before Submit !</p>}
                </Form>
            )}
        </Formik>
    );
};

export default AddDataForm;

// const pattern = /(^[A-Za-z]{3,16})([ ]{0,1})([A-Za-z]{3,16})?([ ]{0,1})?([A-Za-z]{3,16})?([ ]{0,1})?([A-Za-z]{3,16})/; 
// fullname validation using regex use if necessary, do test before deploy // 
// syntax for test .test('isValid', value => pattern.test(value))
