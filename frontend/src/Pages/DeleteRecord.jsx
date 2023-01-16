import { useNavigate, useParams } from 'react-router-dom';
import useApiService from '../Services/APIService';
import VerifyFormik from './AuthSection/VerifyFormik';
import BGPage from './BGPage';
import * as Yup from 'yup';

const DeleteRecord = () => {
    const { id } = useParams();
    const deleteRecord = useApiService(s => s.deleteRecord);
    const error = useApiService(s => s.error);
    const loading = useApiService(s => s.isLoading);
    const route = useNavigate();

    const handleSubmit = async (values, actions) => {
        const stat = await deleteRecord(id, values?.password);
        if (stat === true) return route('/', { replace: true });
        return;
    };

    const schema = Yup.object().shape({
        password: Yup.string().min(6).max(19).required()
    });

    const prop = {
        handleSubmit,
        fields: [{
            label: "Password",
            type: "password",
            name: "password",
            placeholder: "Enter Password"
        }],
        schema,
        initialValues: { password: "" },
        error,
        loading
    };

    return (
        <BGPage image={1} center={1}>
            <section className='bg-white rounded-lg flex flex-col items-center p-8 bg-opacity-50'>
                <h1 className='text-3xl mb-8 font-semibold'>Please Verify </h1>
                <VerifyFormik controllers={prop} />
            </section>
        </BGPage>
    );
};

export default DeleteRecord;