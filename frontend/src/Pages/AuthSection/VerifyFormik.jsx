import { Form, Formik } from 'formik';
import CustomField from '../../Components/Input/CustomField';
import Loader from '../../Components/Loader/Loader';
import SubmitBtn from '../../Components/Button';

const VerifyFormik = ({ controllers }) => {
    const { handleSubmit,
        schema,
        initialValues,
        error,
        loading,
        fields = []
    } = controllers;

    return (
        <Formik initialValues={initialValues}
            validationSchema={schema}
            onSubmit={handleSubmit}>
            {props => (
                <Form className='flex flex-col items-center gap-3 max-w-[350px] text-center'>
                    {fields.map((field, i) => (
                        <CustomField key={i + 1} {...field} />
                    ))}
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

export default VerifyFormik;