import { Navigate, useNavigate } from "react-router-dom";
import Icon from "../Components/Icon";
import RecordTile from "../Components/RecordTile";
import ScreenLoader from "../Components/ScreenLoader";
import UserTile from "../Components/UserTile";
import useApiService from "../Services/APIService";
import useAuthService from "../Services/AuthService";
import useLocalState from "../Services/LocalState";
import BGPage from "./BGPage";

function AdminPanel() {
    const route = useNavigate();
    const user = useAuthService(s => s.user);
    const getAdminData = useApiService(s => s.getAdminData);
    const loading = useApiService(s => s.isLoading);
    const adminData = useApiService(s => s.adminData);
    const { otps, records, users } = adminData;
    const setEditData = useLocalState(s => s.setEditData);

    function handleDelete(data) { };
    function handleEdit(data) {
        setEditData(data);
        route('/edit-record');
        return;
    };

    console.log(adminData);

    if (!user?.superAdmin) {
        return <Navigate to="/404" />
    };

    return (
        <BGPage center={1} image={1} >
            {loading && <ScreenLoader />}
            <h3 className='font-semibold text-3xl text-emerald-700 text-center p-2' >Admin Panel</h3>
            <button disabled={loading} onClick={getAdminData}
                className="py-2 px-6 bg-sky-800 text-white hover:bg-blue-800 disabled:cursor-not-allowed" >
                Get All Data
            </button>
            <main className="text-center my-2">
                <h2 className="font-medium text-3xl">OTP Records</h2>
                <section className="data flex flex-row gap-2 flex-wrap my-2 p-2 justify-center items-center text-center">
                    {otps?.map((otp) => (
                        <div className={`p-2 ${otp?.verified ? "bg-green-300" : "bg-zinc-300"} bg-opacity-40 text-gray-800 hover:bg-opacity-100 flex flex-col gap-2 flex-wrap
                                text-start relative font-medium rounded-lg text-lg min-w-[250px] overflow-hidden max-w-[90vw]`}
                            key={otp?._id} >
                            <b className="truncate max-w-[90vw]"> {otp?.email}</b>
                            <div className="flex flex-row gap-2 top-1 right-1">
                                <Icon size={33} color="#005c63" label="Edit Record" icon="material-symbols:edit-document"
                                    onClick={() => { handleEdit(otp); }}
                                />
                                <Icon size={36} color="#e40800" label="Delete Record" icon="ic:round-delete-sweep"
                                    onClick={() => { handleDelete(otp); }}
                                />
                            </div>
                        </div>
                    ))}
                </section>
            </main>
            <main className="my-2">
                <h2 className="font-medium text-3xl text-center">Active Users</h2>
                <div className="flex flex-col md:flex-row flex-wrap items-center justify-center gap-2">
                    {users?.map((userdoc) => (
                        <div key={userdoc?._id} className="relative">
                            <UserTile userdoc={userdoc} />
                        </div>
                    ))}
                </div>
            </main>

            <main className="my-2">
                <center className="font-medium text-3xl">Patient Records</center>
                <div className="flex flex-wrap items-center justify-center gap-2">
                    {records?.map((record) => (
                        <div key={record?._id} className="relative">
                            <RecordTile record={record} />
                            <div className="flex absolute right-2 top-2 flex-row-reverse gap-2">

                                <Icon size={36} color="#e40800" label="Delete Record" icon="ic:round-delete-sweep"
                                    onClick={() => { handleDelete(record); }}
                                />
                                <Icon size={33} color="#005c63" label="Edit Record" icon="material-symbols:edit-document"
                                    onClick={() => { handleEdit(record); }}
                                />

                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </BGPage>
    );
};

export default AdminPanel;