import { useEffect, useRef } from "react";
import Loader from "../Components/Loader/Loader";
import parse from 'html-react-parser';
import useApiService from "../Services/APIService";
import Icon from "../Components/Icon";
import { useNavigate } from "react-router-dom";
import useLocalState from "../Services/LocalState";
import TopBar from "../Components/TopBar";
import Sidebar from "../Components/Sidebar";
import BGPage from "./BGPage";

const scrollState = document?.body?.style?.overflow ?? "";

const ViewRecords = () => {
    console.log("VALUE OF SCROLLSTATE",scrollState);
    const route = useNavigate();
    const getRecords = useApiService(s => s.getRecords);
    const patientRecords = useApiService(s => s.patientRecords);
    const isLoading = useApiService(s => s.isLoading);
    const setEditData = useLocalState(s => s.setEditData);
    const sideBarRef = useRef();
    const setErrorView = useApiService(s => s.setErrorView);

    const editData = (data) => {
        setEditData(data);
        route('/edit-record');
        return;
    };

    const disableScroll = (value) => {
        document.body.style.overflow = (value === true) ? 'hidden' : scrollState;
    };

    const openSideBar = () => {
        sideBarRef.current.style.visibility = "visible";
        disableScroll(true);
        return;
    };

    const handleDelete = ({ _id }) => {
        route(`/delete-record/${_id}`);
        return;
    };

    useEffect(() => {
        const controller = new AbortController();
        if (patientRecords?.length <= 0) getRecords(controller.signal);
        return () => controller?.abort();
    }, [getRecords]);

    useEffect(() => {
        return () => {
            disableScroll(false);
            setErrorView(false);
        };
    }, []);

    console.count("Rendered ViewRecords.jsx");
    return (
        <BGPage image={0}>
            <Sidebar ref={sideBarRef} controllers={{ disableScroll }} />
            <section className="w-full py-4 bg-black bg-opacity-5 min-h-[94vh]">
                <h1 className="text-4xl text-black text-center py-3">Patient Records</h1>
                <h2 className="text-center py-2 font-semibold">
                    {patientRecords?.length > 0 ?
                        `Displaying Total Of ${patientRecords?.length ?? 0} Records from Database`
                        : "No Records Found"}
                </h2>
                {isLoading && <Loader />}
                <div className="flex flex-wrap items-center justify-center gap-2">
                    <TopBar openFilter={openSideBar} />
                    {patientRecords?.map((record) => (
                        <div className="bg-white bg-opacity-40 text-gray-800 hover:bg-opacity-100 flex flex-col gap-2 min-h-[250px]
                            sm:min-h-[200px] relative p-4 font-medium min-w-[90vw] rounded-lg" key={record._id}>
                            <p className="text-3xl capitalize font-semibold">{record?.name}</p>
                            {record?.age && <p className="text-xl">Age: {record?.age}</p>}
                            <p className="text-xl capitalize">{record?.city}</p>
                            <p className="text-lg">{new Date(record?.lastCheckup?.[0]).toLocaleDateString()}</p>
                            <div className="absolute left-1/3 top-3 overflow-hidden max-h-[180px] hidden md:block">
                                {parse(record?.document)}
                            </div>
                            {/* AvatarSection */}
                            <div className="absolute right-2 bottom-2 flex flex-row-reverse flex-wrap gap-2">
                                <Icon w={36} h={36} color="#006d5b" label="Edit Record" onClick={() => editData(record)}
                                    icon="material-symbols:edit-document-rounded" />
                                <Icon w={36} h={36} color="#008080" onClick={() => route(`/view-record/${record._id}`)}
                                    label="Expand View" icon="mdi:arrow-expand-all" />
                                <Icon w={36} h={36} color="#e40800" label="Delete Document" icon="mdi:file-document-delete"
                                    onClick={() => {
                                        if (window.confirm("This Record Will be Deleted!, Continue ?")) handleDelete(record);
                                    }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </BGPage>
    );
};

export default ViewRecords;