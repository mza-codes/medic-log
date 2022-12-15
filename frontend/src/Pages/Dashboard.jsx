import useAuthService from "../Services/AuthService";
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const { user } = useAuthService();
    console.log("%cLogging USER", "color:cyan", user);

    return (
        <main className="w-full h-[94vh] bg-teal-100 p-2">
            <h2 className="text-4xl font-semibol py-2 text-teal-900 font-kanit">Welcome, {user?.name ?? "User"}</h2>
            <section className="w-full">
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
                <Link to='/add-record' className="bg-teal-100 text-slate-800 hover:bg-emerald-200">Add Patient Data</Link>
            </section>
        </main>
    )
};

export default Dashboard;