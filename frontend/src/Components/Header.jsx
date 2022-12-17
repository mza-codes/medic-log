import { Link } from "react-router-dom";
import useAuthService from "../Services/AuthService";

// header height : 6vh
const Header = () => {
    const { user } = useAuthService();

    return (
        <header className='w-full h-[6vh] bg-teal-600 wrapper flex relative items-center'>
            <Link className="logo absolute top-0 left-2 flex items-center text-black text-opacity-40 hover:text-opacity-90 max-h-[6vh]"
                to="/" >
                <iconify-icon icon="system-uicons:document-stack" width={34} height={34} />
                <h3 className="cursor-pointer text-2xl p-2 font-semibold font-abel">
                    Medic Log
                </h3>
            </Link>
            <div className="actions absolute top-0 right-2 max-h-[6vh]">
                <h3 className="text-slate-900 text-opacity-60 hover:text-opacity-90 hover:text- cursor-pointer
                        text-xl p-2 font-abel font-semibold">
                    {user?.name ?? ""}
                </h3>
            </div>
        </header>
    );
};

export default Header;