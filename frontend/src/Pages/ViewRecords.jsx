import { useEffect } from "react";
import Loader from "../Components/Loader/Loader";
import parse from 'html-react-parser';
import useApiService from "../Services/APIService";
import Icon from "../Components/Icon";
import { useNavigate } from "react-router-dom";
import useLocalState from "../Services/LocalState";

const ViewRecords = () => {
    const route = useNavigate();
    const getRecords = useApiService(s => s.getRecords);
    const patientRecords = useApiService(s => s.patientRecords);
    const isLoading = useApiService(s => s.isLoading);
    const setEditData = useLocalState(s => s.setEditData);

    const editData = (data) => {
        setEditData(data);
        route('/edit-record');
    };

    useEffect(() => {
        const controller = new AbortController();
        getRecords(controller.signal);
        return () => controller.abort();
    }, [getRecords]);

    console.count("Rendered ViewRecords.jsx");
    return (
        <main className='w-full min-h-[94vh] relative bg-gradient-to-r from-teal-50 via-emerald-100 to-teal-100'>
            <section className="w-full py-4 bg-black bg-opacity-5 min-h-[94vh]">
                <h1 className="text-4xl text-black text-center py-3">Patient Records</h1>
                {isLoading && <Loader />}
                <div className="flex flex-wrap items-center justify-center gap-2">

                    {patientRecords?.map((record) => (
                        <div className="bg-white bg-opacity-40 text-gray-800 hover:bg-opacity-100 flex flex-col gap-2 min-h-[200px]
                         relative p-4 font-medium min-w-[90vw] rounded-lg" key={record._id}>
                            <p className="text-3xl capitalize">{record?.name}</p>
                            {record?.age && <p className="text-xl">Age: {record?.age}</p>}
                            <p className="text-xl capitalize">{record?.city}</p>
                            <p className="text-lg">{new Date(record?.lastCheckup?.[0]).toLocaleString()}</p>
                            <div className="absolute left-1/3 top-3 overflow-hidden max-h-[180px]">
                                {parse(record?.document)}
                            </div>
                            {/* <AvatarSection /> */}
                            <div className="absolute right-2 bottom-2" onClick={() => editData(record)}>
                                <Icon w={36} h={36} color="#006d5b" label="Edit Record"
                                    icon="material-symbols:edit-document-rounded" />
                            </div>
                            <div className="absolute right-[3rem] bottom-2" onClick={() => { }}>
                                <Icon w={36} h={36} color="#008080" label="Expand View"
                                    icon="mdi:arrow-expand-all" />
                            </div>
                        </div>
                    ))}

                </div>
            </section>
        </main>
    );
};

export default ViewRecords;