import { lazy, Suspense } from "react";
import AddDataForm from "../Components/Forms/AddData";
// import { bg } from "../Assets";
import Loader from "../Components/Loader/Loader";

const RTF = lazy(() => import("../Components/Forms/RichTextEditor.jsx"));

const AddRecord = () => {

    return (
        <main 
        // style={{ backgroundImage: `url(${bg})` }} 
        className='w-full min-h-[94vh] relative bg-gradient-to-r from-teal-50 via-emerald-100 to-teal-100'>
            <section className="w-full py-4 bg-black bg-opacity-5 min-h-[94vh]">
                <h2 className="text-3xl font-semibold text-center my-3">Add Patient Data</h2>
                <AddDataForm />
                <Suspense fallback={<Loader />}>
                        <div className="max-w-[100vw] p-2 flex flex-col items-center justify-center">
                            <h1 className="text-4xl my-2 text-center">Add Patient Log</h1>
                            <RTF />
                        </div>
                </Suspense>
            </section>
        </main>
    );
};

export default AddRecord;