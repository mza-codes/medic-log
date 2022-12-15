import { lazy, Suspense } from "react";
import { bg } from "../Assets";
import AddData from "../Components/Forms/AddData";
import EditorData from "../Components/Forms/EditorData";
import Loader from "../Components/Loader/Loader";

const RTF = lazy(() => import("../Components/Forms/RichTextEditor.jsx"));

const AddRecord = () => {

    return (
        <main style={{ backgroundImage: `url(${bg})` }} className='w-full min-h-[94vh] bg-cover relative'>
            <section className="w-full py-4 bg-black bg-opacity-5 min-h-[94vh]">
                <h2 className="text-3xl font-semibold text-center my-3">Add Patient Data</h2>
                <AddData />
                <Suspense fallback={<Loader />}>
                        <div className="max-w-[100vw] p-2 flex flex-col items-center justify-center">
                            <h1 className="text-4xl my-2 text-center">Add Patient Log</h1>
                            <RTF className="lg:max-w-[800px]" />
                        </div>
                </Suspense>
                {/* <EditorData /> */}
            </section>
        </main>
    );
};

export default AddRecord;