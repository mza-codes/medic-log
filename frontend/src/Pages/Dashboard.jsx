import useAuthService from "../Services/AuthService";
import { Link } from 'react-router-dom';
import BGPage from "./BGPage";
import Loader from "../Components/Loader/Loader";
import { useRef } from "react";

const Dashboard = () => {
    const user = useAuthService(s => s.user);
    const logout = useAuthService(s => s.logout);
    const loading = useRef();
    const logoutBtn = useRef();
    console.log("%cLogging USER", "color:cyan", user);

    const handleLogOut = async () => {
        logoutBtn.current.disabled = true;
        loading.current.style.visibility = "visible";
        await logout();
        return;
    };

    return (
        <BGPage image={1}>
            <section className="p-2 mx-2 flex gap-2 justify-between">
                <h2 className="text-4xl font-semibol py-2 text-teal-900 font-kanit">Welcome, {user?.name ?? "User"}</h2>
                <div className="infoSection text-xl text-teal-800">
                    Org Name: MJOWER HealthCare
                    <br />
                    Location: THR,Nr. Area 780  {user?.country}
                    <br />
                    Total Logs: 45
                    <br />
                    Activity: Recent
                    <br />
                    Traffic: Low
                    <br />
                    Closed Cases: 24
                    <br />
                    Pending Cases: 18
                </div>
                <div className="flex flex-col gap-2 my-2">
                    <Link to='/add-record' className="bg-green-800 text-white hover:bg-green-600 p-2 rounded-lg ">
                        Add Patient Data
                    </Link>

                    <Link to='/view-records' className="bg-teal-800 text-white hover:bg-teal-700 p-2 rounded-lg ">
                        View All Patients Data
                    </Link>

                    <Link to='/delete-record/hfdtrgdttre' className="bg-emerald-800 text-white hover:bg-emerald-700 p-2 rounded-lg ">
                        Re Auth
                    </Link>

                    <button type="button" onClick={handleLogOut} ref={logoutBtn}
                        className="my-3 bg-red-800 text-white hover:bg-red-700 p-2 rounded-lg
                         disabled:bg-gray-400 disabled:hover:bg-gray-400">
                        Log Out
                    </button>
                    <div ref={loading} className="invisible">
                        <Loader inline={1} tailwindBg="bg-red-800" />
                    </div>
                </div>

            </section>
        </BGPage>
    );
};

export default Dashboard;