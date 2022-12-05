import { Link } from "react-router-dom";


const Verify = () => {
    return (
        <main className="min-w-[280px] sm:min-w-[340px] min-h-fit bg-white  rounded-xl
            flex flex-col text-start gap-3 py-4 px-6 mb-48">
            <h3 className="text-2xl font-medium py-2 text-emerald-900">Verification </h3>

            <input type="text" placeholder="Enter Verification Code"
                className="p-2 rounded-md outline-none border-2 border-slate-400 focus:border-slate-700" />
            <button type="button" className="bg-emerald-200 hover:bg-emerald-500 hover:text-white
                p-2 w-fit rounded-sm text-gray-800" >Submit</button>

            <span className="text-red-400">Verification Failed !</span>
            <Link to="/" className=' text-emerald-500 hover:text-emerald-800 mb-2' >Have'nt Receieved Verification Code ?</Link>
        </main>
    );
};

export default Verify