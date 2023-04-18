import BGPage from "./BGPage";
import { Link, useParams } from "react-router-dom";
import useApiService from "../Services/APIService";
import Loader from "../Components/Loader/Loader";
import parse from "html-react-parser";
import { useEffect } from "react";
import { RTFDoc } from "../Components/RTFStyles";
import { AvatarView } from "../Components/Forms/AvatarSection";
import DataCard from "../Components/DataCard";
import SVG from "../Components/SVG";

const ViewDoc = () => {
    const { id } = useParams();
    const isLoading = useApiService(s => s.isLoading);
    const fetchRecord = useApiService(s => s.fetchRecord);
    const record = useApiService(s => s.patientRecord);

    useEffect(() => {
        const controller = new AbortController();
        fetchRecord(id, controller.signal);
        return () => controller?.abort();
        // eslint-disable-line
    }, []);

    return (
        <BGPage image={1} center={1}>
            {isLoading ? <Loader /> :
                (!isLoading && record) ? (
                    <main className="flex flex-col gap-4 mt-3 items-center justify-center">
                        <DataCard data={record} />
                        <section className="relative">
                            <RTFDoc className='min-w-[90vw] lg:min-w-[800px]'>
                                {parse(record?.document)}
                            </RTFDoc>
                            <AvatarView />
                        </section>
                    </main>
                ) 
                : <div className="flex flex-col items-center text-center"> <SVG icon={"material-symbols:error-rounded"} w={150} h={150} color="#da8d00"/>
                    <span className="text-xl font-medium text-red-800 max-w-[500px]">{`Could'nt fetch Record with ID "${id}"`}</span>
                    <Link to="/dashboard" className="bg-teal-800 text-white hover:bg-teal-600 p-2 rounded-md my-2" >Home</Link>
                </div>
            }
        </BGPage>
    );
};

export default ViewDoc;