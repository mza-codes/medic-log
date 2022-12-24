import { Link } from "react-router-dom";
import useAuthService from "../Services/AuthService";
import Icon from "./Icon";

// header height : 6vh
const Header = () => {
    const user = useAuthService(s => s.user);
    const userActive = useAuthService(s => s.active);
    const logout = useAuthService(s => s.logout);

    return (
        <header className='w-full h-[6vh] bg-teal-600 wrapper flex relative items-center'>
            <Link className="logo absolute top-0 left-2 flex items-center text-black text-opacity-40 hover:text-opacity-90 max-h-[6vh]"
                to="/" >
                <iconify-icon icon="system-uicons:document-stack" width={34} height={34} />
                <h3 className="cursor-pointer text-2xl p-2 font-semibold font-abel">
                    Medic Log
                </h3>
            </Link>
            <div className="actions absolute top-1 right-2 max-h-[6vh] flex items-center">
                <h3 className="text-slate-900 text-opacity-60 hover:text-opacity-90 hover:text- cursor-pointer
                        text-xl p-2 font-abel font-semibold">
                    {user?.name ?? " "}
                </h3>
                {userActive && <div className="logout cursor-pointer" onClick={e => logout()}>
                    <Icon icon="mdi:logout" w={28} h={28} label="Logout" />
                </div>}
            </div>
        </header>
    );
};

export default Header;