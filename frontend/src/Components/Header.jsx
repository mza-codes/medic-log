import { Link } from "react-router-dom";
import useAuthService from "../Services/AuthService";
import Icon from "./Icon";
import ScreenLoader from "./ScreenLoader";

// header height : 6vh
const Header = () => {
    const user = useAuthService(s => s.user);
    const userActive = useAuthService(s => s.active);
    const logout = useAuthService(s => s.logout);

    console.count("Rendered HEADER");
    return (
        <header className='w-full h-[70px] bg-teal-600 flex relative items-center justify-between gap-2 px-4 shadow-lg'>
            <div className="hidden">
                <ScreenLoader />
            </div>
            <Link className="logo flex items-center text-black text-opacity-40 hover:text-opacity-90 max-h-[70px]"
                to="/dashboard" >
                <iconify-icon icon="system-uicons:document-stack" width={34} height={34} />
                <h3 className="cursor-pointer text-2xl p-2 font-semibold font-abel">
                    Medic Log
                </h3>
            </Link>
            <div className="actions max-h-[70px] flex items-center">
                <h3 className="text-slate-900 text-opacity-60 hover:text-opacity-90 cursor-pointer text-xl p-2 font-abel font-semibold hidden sm:block">
                    {user?.name ?? " "}
                </h3>
                {userActive && <div className="logout cursor-pointer" onClick={logout}>
                    <Icon icon="mdi:logout" w={28} h={28} label="Logout" />
                </div>}
            </div>
        </header>
    );
};

export default Header;