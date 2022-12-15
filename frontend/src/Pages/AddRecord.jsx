import { lazy, Suspense } from "react";
import AddDataForm from "../Components/Forms/AddData";
import Loader from "../Components/Loader/Loader";

const Documenter = lazy(() => import("../Components/Documenter"));

const AddRecord = () => {

    return (
        <main className='w-full min-h-[94vh] relative bg-gradient-to-r from-teal-50 via-emerald-100 to-teal-100'>
            <section className="w-full py-4 bg-black bg-opacity-5 min-h-[94vh]">
                <h2 className="text-3xl font-semibold text-center my-3">Add Patient Data</h2>
                <AddDataForm />
                <Suspense fallback={<Loader />}>
                    <Documenter />
                </Suspense>
            </section>
        </main>
    );
};

export default AddRecord;