import { useLayoutEffect } from "react";

const ErrorBar = ({ msg = `Unable to connect with server!`, color }) => {

    useLayoutEffect(() => {
        const errBox = document.getElementById('errBox');

        const timeout = setTimeout(() => {
            errBox.classList.add("hoverEffects");
        }, 45 * 1000);

        return () => clearTimeout(timeout);
    }, []);

    return (
        <center style={{ color }} id="errBox" className='bg-black text-[#ff3d3d] p-3 w-fit fixed bottom-1 left-1 flex items-center '>
            {msg} &nbsp;
            <iconify-icon icon="material-symbols:error-circle-rounded" width={36} height={36} />
        </center>
    );
};

export default ErrorBar;
