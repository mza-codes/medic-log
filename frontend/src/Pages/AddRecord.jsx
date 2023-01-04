import { lazy, Suspense } from "react";
import AddDataForm from "../Components/Forms/AddData";
import Loader from "../Components/Loader/Loader";
import BGPage from "./BGPage";

const Documenter = lazy(() => import("../Components/Documenter"));

const AddRecord = () => {

    return (
        <BGPage image={0}>
            <section className="w-full py-4 bg-black bg-opacity-5 min-h-[94vh]">
                <h2 className="text-3xl font-semibold text-center my-3">Add Patient Data</h2>
                <AddDataForm />
                <Suspense fallback={<Loader />}>
                    <Documenter />
                </Suspense>
            </section>
        </BGPage>
    );
};

export default AddRecord;