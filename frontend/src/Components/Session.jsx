import { useEffect } from "react";
import useAuthService from "../Services/AuthService";

const Session = () => {
    let msg = "A Test @$#4";
    const expiration = useAuthService(s.expiresIn);

    useEffect(() => {
        const errBox = document.getElementById('errBox');

        const timeout = setTimeout(() => {
            errBox.classList.add("hoverEffects");
        }, 45 * 1000);

        return () => clearTimeout(timeout);
    }, []);

    useEffect(() => {
        
    }, [expiration]);

    return (
        <center style={{ color }} id="errBox" className='bg-black text-[#ff3d3d] p-3 w-fit absolute bottom-1 right-1 flex items-center '>
            {msg} &nbsp;
            <iconify-icon icon="material-symbols:error-circle-rounded" width={36} height={36} />
        </center>
    );
};

export default Session;