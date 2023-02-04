import { useEffect, useState } from "react";
import { HandledText, ToastWrapper } from ".";
import useAuthService from "../Services/AuthService";
import Icon from "./Icon";

function InfoToast() {
    const info = useAuthService(s => s.info);
    const setInfo = useAuthService(s => s.setInfo);

    const [msg, setMsg] = useState("");
    const [view, setView] = useState(false);

    function hideInfo() {
        if (msg.charAt(0) === "O" && msg.charAt(1) === "T"
            && msg.charAt(2) === "P") {
            return false;
        };
        setTimeout(() => {
            setInfo(null);
        }, 8000);
        return;
    };

    const handleError = (obj) => {
        if (obj?.message?.length > 0) {
            setView(true);
            console.log(obj?.message);
            return setMsg(obj?.message ?? "");
        };
        return;
    };

    useEffect(() => {
        handleError(info);
        return () => {
            setView(false);
        };
    }, [info]);

    useEffect(() => {
        const id1 = setTimeout(() => {
            setView(false);
            hideInfo();
        }, 5 * 1000);
        return () => {
            clearTimeout(id1)
        };
    }, [info]);

    if (view)
        return (
            <ToastWrapper onClick={() => setView(false)} color="#197e00" className="md:top-[20px] top-[30px] md:w-[480px] w-[90%]">
                <Icon size={10} icon="eva:close-outline" color={"red"} label="Dismiss" classes="absolute right-1 top-1" />
                <section className="hover:shadow-2xl bg-white shadow-xl my-1 px-2 py-3 flex items-center gap-2 
                    justify-center rounded-md">
                    <iconify-icon width={36} height={36} icon="mdi:success-bold" />
                    <HandledText maxlines={3} className="text-sm font-semibold text-slate-800">
                        {msg}
                    </HandledText>
                </section>
            </ToastWrapper>
        );
    else return null;
};

export default InfoToast;