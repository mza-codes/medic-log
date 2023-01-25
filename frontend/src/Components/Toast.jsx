import { useEffect, useState } from "react";
import styled from "styled-components";
import useApiService from "../Services/APIService";
import useAuthService from "../Services/AuthService";

const ToastWrapper = styled.main`
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    position: fixed;
    z-index: 1552;
    left: 50%;
    right: 50%;
    transform: translate(-50%,-50%);
    min-width: 280px;
    min-height: 50px;
    transition: all 600ms linear;
    gap: 6px;
    color: ${(props) => props.color};
`;

function Toast() {
    const info = useAuthService(s => s.info)
    const err = useAuthService(s => s.error);
    const error = useApiService(s => s.error);
    const [msg, setMsg] = useState("");
    const [view, setView] = useState(false);

    // useEffect(() => {
    //     function handleError() {
    //         if (err?.message) {
    //             setView(true);
    //             return setMsg(err?.message ?? "Unknwon Error Occured!")
    //         };
    //         if (error?.active) {
    //             setView(true);
    //             return setMsg(error?.message ?? "Unknwon Error Occured!")
    //         };
    //         if (info?.message) {
    //             setView(true);
    //             return setMsg(info?.message ?? "Unknwon Error Occured!")
    //         };
    //     };
    //     handleError();
    // }, [err, error, info]);

    const handleError = (obj) => {
        obj?.message && setView(true);
        return setMsg(obj?.message ?? "");
    };

    useEffect(() => {
        handleError(err);
    }, [err]);
    useEffect(() => {
        handleError(info);
    }, [info]);
    useEffect(() => {
        handleError(error);
    }, [error]);

    useEffect(() => {
        const id1 = setTimeout(() => {
            setView(false);
        }, 3000);
        return () => clearTimeout(id1);
    }, [err, error, info]);

    console.log({ info, err, error, msg });
    console.count("Rendered ToastSS");
    if (view)
        return (
            <ToastWrapper color="red" className="bg-white shadow-2xl my-1 p-2 md:top-[40px] top-[50px] md:w-[480px] w-[90%]">
                <iconify-icon width={30} height={30} icon="material-symbols:error-circle-rounded" />
                <span className="truncate-2 font-semibold toast text-slate-800">
                    {msg}
                </span>
            </ToastWrapper>
        );
    else return null;
};

export default Toast;