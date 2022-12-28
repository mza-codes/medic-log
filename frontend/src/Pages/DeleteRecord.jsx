import VerifyPwd from './AuthSection/VerifyPwd';
import BGPage from './BGPage';

const DeleteRecord = () => {

    return (
        <BGPage image={1} center={1}>
            <section className='bg-white rounded-lg flex flex-col items-center p-8 bg-opacity-50'>
                <h1 className='text-3xl mb-8 font-semibold'>Please Verify </h1>
                <VerifyPwd />
            </section>
        </BGPage>
    );
};

export default DeleteRecord;