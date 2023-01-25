import { useEffect, useRef, useState } from "react";
import { ToastWrapper } from ".";
import useApiService from "../Services/APIService";
import useAuthService from "../Services/AuthService";
import Icon from "./Icon";

function Toast() {
    const err = useAuthService(s => s.error);
    const error = useApiService(s => s.error);
    // const [msg, setMsg] = useState(""); used ref methos to prevent rerender
    const msg = useRef("");
    const setMsg = (val) => msg.current = val;
    const [view, setView] = useState(false);

    // eslint-disable-next-line
    const handleError = (obj) => {
        if (obj?.message?.length > 0) {
            setMsg(obj?.message ?? "");
            return setView(true);
        }; return;
    };

    useEffect(() => {
        handleError(err);
        // eslint-disable-next-line
    }, [err]);

    useEffect(() => {
        handleError(error);
        // eslint-disable-next-line
    }, [error]);

    useEffect(() => {
        const id1 = setTimeout(() => {
            setView(false);
        }, 5 * 1000);
        return () => clearTimeout(id1);
    }, [handleError]);

    if (view)
        return (
            <ToastWrapper onClick={() => setView(false)} color="#f00000" 
                className="bg-white shadow-xl my-1 px-2 py-3 md:top-[40px] top-[50px] md:w-[480px] w-[90%] hover:shadow-2xl toast">
                <iconify-icon width={36} height={36} icon="material-symbols:error-circle-rounded" />
                <Icon size={10} icon="eva:close-outline" color={"red"} label="Dismiss" classes="absolute right-1 top-1" />
                <span className="truncate-2 break-words text-sm font-semibold text-slate-800">
                    {/* {msg} */}
                    {msg.current}
                </span>
            </ToastWrapper>
        );
    else return null;
};

export default Toast;