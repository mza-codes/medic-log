import { useEffect, useRef, useState } from "react";
import { HandledText, ToastWrapper } from ".";
import useApiService from "../Services/APIService";
import useAuthService from "../Services/AuthService";
import Icon from "./Icon";

function Toast() {
    const err = useAuthService(s => s.error);
    const resetErr = useAuthService(s => s.resetError);

    const error = useApiService(s => s.error);
    const setErrorView = useApiService(s => s.setErrorView);

    /** @used ref methos to prevent re renders */

    const msg = useRef("");
    const hideError = useRef(null);

    const setMsg = (val) => msg.current = val;
    const [view, setView] = useState(false);

    // eslint-disable-next-line
    const handleError = (obj) => {
        if (obj?.message?.length > 0) {
            setMsg(obj?.message ?? "");
            return setView(true);
        }; return;
    };

    function removeError() {
        setTimeout(() => {
            hideError.current();
        }, 8000);
        return;
    };

    useEffect(() => {
        hideError.current = resetErr;
        handleError(err);
    }, [err]);

    useEffect(() => {
        hideError.current = setErrorView;
        handleError(error);
    }, [error]);

    useEffect(() => {
        const id1 = setTimeout(() => {
            setView(false);
            removeError();
        }, 5 * 1000);
        return () => clearTimeout(id1);
    }, [handleError]);

    if (view)
        return (
            <ToastWrapper onClick={() => setView(false)} color="#f00000"
                className="bg-white shadow-xl my-1 px-2 py-3 md:top-[40px] top-[50px] md:w-[480px] w-[90%] hover:shadow-2xl toast">
                <iconify-icon width={36} height={36} icon="material-symbols:error-circle-rounded" />
                <Icon size={10} icon="eva:close-outline" color={"red"} label="Dismiss" classes="absolute right-1 -top-1" />

                <HandledText maxlines={3} className="text-sm font-semibold text-slate-800">
                    {msg.current}
                </HandledText>
            </ToastWrapper>
        );
    else return null;
};

export default Toast;