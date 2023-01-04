import React from 'react'
import { Link } from 'react-router-dom';
import SVG from '../Components/SVG';
import BGPage from './BGPage';

const classes = {
    mainFont:"text-2xl font-semibold text-emerald-700"
};

const Page404 = () => {

    return (
        <BGPage image={1} center={1}>
            <section className='flex flex-col items-center gap-2'>
            <h2 className={`${classes.mainFont}`}>The page you're looking for is Not Found!</h2>
            <SVG className="animate-pulse" icon={"mdi:warning-box"} color="#078557" w={296} h={296} label="Not Found Logo" />
            <h2 className={`${classes.mainFont}`}>Perhaps You have mistyped the url !</h2>
            <div className="flex gap-2">

            <Link to={-1} className='bg-green-200 hover:bg-green-400 p-2 font-semibold text-black'>Back</Link>
            <Link to="/dashboard" className='bg-teal-200 hover:bg-teal-400 p-2 font-semibold text-black'>Home</Link>
            </div>
            </section>
        </BGPage>
    );
};

export default Page404;