import { useEffect } from "react";
import { SecureAPI } from "../Assets";
import useAuthService from "../Services/AuthService";

const useSecureAPI = () => {

    const refreshSession = useAuthService(s => s.refreshSession);
    const userStat = useAuthService(s => s.active);

    useEffect(() => {
        console.warn("USESEC API LOGGING DATA");
        let controller = new AbortController();
        // const expiration = localStorage.getItem("expiration");
        const resIntercep = SecureAPI.interceptors.response.use(
            response => response,
            async (err) => {
                console.warn("Error from useSecApi intercept", err);
                const prevReq = err?.config;
                if (err?.response?.data?.mesaage === "jwt expired" && !prevReq?.sent) {
                    prevReq.sent = true;
                    const resp = await refreshSession(controller.signal);
                    console.log("DATA from INTERCEP", resp);
                    localStorage.setItem('expiration', resp?.expiry);
                    prevReq.withCredentials = true;
                    return SecureAPI(prevReq);
                };
                return Promise.reject(err);
            });

        return () => {
            SecureAPI.interceptors.response.eject(resIntercep);
            controller?.abort();
        };
    }, [userStat, refreshSession]);

    return SecureAPI;
};

// export default useSecureAPI;
// unused 
