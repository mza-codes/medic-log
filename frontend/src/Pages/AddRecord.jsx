import { lazy, Suspense } from "react";
import { bg } from "../Assets";
import AddData from "../Components/Forms/AddData";
import Loader from "../Components/Loader/Loader";

const RTF = lazy(() => import("../Components/Forms/RichTextEditor.jsx"));

const AddRecord = () => {

    return (
        <main style={{ backgroundImage: `url(${bg})` }} className='w-full min-h-[94vh] bg-cover relative'>
            <section className="w-full py-4 bg-black bg-opacity-5 min-h-[94vh]">
                <h2 className="text-3xl font-semibold text-center my-3">Add Person Data</h2>
                <AddData />
                <Suspense fallback={<Loader />}>
                    <section className="max-w-[100%] p-1">
                        <center className="text-4xl my-2">Description</center>
                        <RTF />
                    </section>
                </Suspense>
            </section>
        </main>
    );
};

export default AddRecord;