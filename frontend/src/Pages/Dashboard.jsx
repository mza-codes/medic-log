import useAuthService from "../Services/AuthService";
import { Link } from 'react-router-dom';
import BGPage from "./BGPage";
import ScreenLoader from "../Components/ScreenLoader";

const Dashboard = () => {
    const user = useAuthService(s => s.user);
    const logout = useAuthService(s => s.logout);
    const loading = useAuthService(s => s.isLoading);

    return (
        <BGPage image={1}>
            {loading && <ScreenLoader />}
            <section className="p-2 mx-2 flex gap-2 justify-between flex-wrap">
                <article className="flex flex-col gap-2 text-xl font-medium text-teal-900 capitalize shadow-lg hover:shadow-2xl
                     bg-teal-900 bg-opacity-20 p-2 rounded-lg transition-all">
                    <h2 className="text-4xl font-semibol py-2 font-kanit">
                        Welcome, {user?.name ?? "User"}
                    </h2>

                    <span className="text-2xl"> Location: <strong> {user?.country}</strong></span>

                    <span className="text-xl"> Total Logs: <strong> 45</strong></span>

                    <span className="text-lg"> Activity: <strong>Recent</strong></span>

                    <span className="text-base"> Traffic:  <strong>Low</strong></span>

                    <span className="text-base"> Closed Cases: <strong> 24</strong></span>

                    <span className="text-base"> Pending Cases: <strong> 18</strong></span>

                </article>

                <div className="flex flex-col gap-2 my-2">
                    <Link to='/add-record' className="bg-green-800 text-white hover:bg-green-600 p-2 rounded-lg ">
                        Add Patient Data
                    </Link>

                    <Link to='/view-records' className="bg-teal-800 text-white hover:bg-teal-700 p-2 rounded-lg ">
                        View All Patients Data
                    </Link>

                    <Link to='/masked/dtrgdttre' className="bg-emerald-800 text-white hover:bg-emerald-700 p-2 rounded-lg ">
                        404
                    </Link>

                    <button type="button" onClick={() => logout()} disabled={loading}
                        className="my-3 bg-red-800 text-white hover:bg-red-700 p-2 rounded-lg
                         disabled:bg-gray-400 disabled:hover:bg-gray-400">
                        Log Out
                    </button>

                </div>

            </section>
        </BGPage>
    );
};

export default Dashboard;