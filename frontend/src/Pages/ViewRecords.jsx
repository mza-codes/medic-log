import { useEffect } from "react";
import Loader from "../Components/Loader/Loader";
import useApiService from "../Services/APIService";
import TopBar from "../Components/TopBar";
import BGPage from "./BGPage";
import FilterModal from "../Components/FilterModal";
import RecordTile from "../Components/RecordTile";

const ViewRecords = () => {
    const getRecords = useApiService(s => s.getRecords);
    const patientRecords = useApiService(s => s.patientRecords);
    const isLoading = useApiService(s => s.isLoading);
    const info = useApiService(s => s.info);

    useEffect(() => {
        const controller = new AbortController();
        getRecords(controller.signal);
        return () => controller?.abort();
        // eslint-disable-next-line
    }, [getRecords]);

    console.count("Rendered ViewRecords.jsx");
    return (
        <BGPage image={0}>
            <FilterModal />
            <section className="w-full py-4 bg-black bg-opacity-5 min-h-[94vh]">
                <h1 className="text-4xl text-black text-center py-3">Patient Records</h1>
                <h2 className="text-center py-2 font-semibold">
                    {patientRecords?.length > 0 ?
                        `Displaying Total Of ${patientRecords?.length ?? 0} Records from Database`
                        : "No Records Found"}
                </h2>
                {info?.active && <h3 className="text-center py-2 font-semibold">{info?.message}</h3>}
                {isLoading && <Loader />}
                <div className="flex flex-wrap items-center justify-center gap-2">
                    <TopBar />
                    {patientRecords?.map((record) => (
                        <RecordTile key={record?._id} record={record} />
                    ))}
                </div>
            </section>
        </BGPage>
    );
};

export default ViewRecords;