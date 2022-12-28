import { Form, Formik } from 'formik';
import CustomField from '../../Components/Input/CustomField';
import Loader from '../../Components/Loader/Loader';
import * as Yup from 'yup';
import SubmitBtn from '../../Components/Button';
import { useNavigate, useParams } from 'react-router-dom';
import useApiService from '../../Services/APIService';

const VerifyPwd = () => {
    const { id } = useParams();
    const error = useApiService(s => s.error);
    const deleteRecord = useApiService(s => s.deleteRecord);
    const loading = useApiService(s => s.isLoading);
    const route = useNavigate();

    const valSchema = Yup.object().shape({
        password: Yup.string().min(6).max(19).required()
    });

    const handleSubmit = async (values, actions) => {
        console.warn(values);
        const stat = await deleteRecord(id, values?.password);
        if (stat === true) return route('/', { replace: true });
        return;
    };

    console.log(error);

    return (
        <Formik initialValues={{ password: "" }}
            validationSchema={valSchema}
            onSubmit={handleSubmit}>
            {props => (
                <Form className='flex flex-col items-center gap-3 max-w-[350px] text-center'>
                    <CustomField label="Password" type="password" name="password" placeholder="Enter Password" />
                    {(loading) && <Loader inline={1} />}
                    {(error?.active && !loading) && <span className="text-[red]">{error?.message ?? error?.error}</span>}
                    <SubmitBtn type="submit"
                        label={loading ? "Loading" : "Submit"}
                        title="Submit"
                        disabled={!props.isValid || loading} />
                </Form>
            )}
        </Formik>
    );
};

export default VerifyPwd;