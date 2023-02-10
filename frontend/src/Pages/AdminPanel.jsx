import { Navigate } from "react-router-dom";
import useAuthService from "../Services/AuthService";
import BGPage from "./BGPage";

function AdminPanel() {
    const user = useAuthService(s => s.user);

    function getData() {
        // case for get Admin data
    };

    if (!user?.superAdmin) {
        return <Navigate to="/404" />
    };

    return (
        <BGPage center={1} image={1} >
            <h3 className='font-semibold text-3xl text-emerald-700 text-center p-2' >Admin Panel</h3>
            <button onClick={getData} className="py-2 px-6 bg-sky-800 text-white hover:bg-indigo-800" >Get All Data</button>
        </BGPage>
    );
};

export default AdminPanel;