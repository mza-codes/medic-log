import axios from 'axios';
import background from './bg-small.jpg';
import avatar from './avatar.jpg';
import useAuthService, { errToast } from '../Services/AuthService';

axios.defaults.withCredentials = true;
let retried = false;

export const bg = background;
export const defaultAvatar = avatar;

// 30 seconds timeout set
export const API = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    timeout: 1000 * 30
});

export const SecureAPI = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    timeout: 1000 * 30,
    withCredentials: true
});

export const resIntercep = SecureAPI.interceptors.response.use(
    response => {
        getVal();
        retried = false;
        return response;
    },
    async (err) => {
        getVal();
        if (err?.code === "ECONNABORTED") {
            console.warn("Server Timeout!");
            errToast.current.style.visibility = "visible";
        };
        if (err?.response?.data?.message === "jwt expired" && !retried) {
            const controller = new AbortController();
            const prevReq = err?.config;
            retried = true;
            try {
                const resp = await SecureAPI.post('/auth/refresh-session', {}, {
                    withCredentials: true, signal: controller.signal
                });
                console.log("DATA from INTERCEP", resp);
                localStorage.setItem('expiration', resp?.expiry);
                return SecureAPI(prevReq);
            } catch (err) {
                console.warn("Error in interceptor", err);
                return err;
            };
        };
        return Promise.reject(err);
    });

function getVal() {
    console.log("GetState method", useAuthService.getState().user);
};

// This code works before request & there can be minor change in expiration time and not recommended!

// SecureAPI.interceptors.request.use(async (config) => {
//     const expiration = localStorage.getItem("expiration");
//     console.warn("Interceptor LOG: ", expiration);
//     if ((expiration * 1000) < new Date().getTime()) {
//         console.warn("using incerceptor !!!");
//         const { data } = await API.get('/auth/is-valid', { withCredentials: true });
//         console.log("INTERCEPTOR Response: >", data);
//         localStorage.setItem("expiration", data?.expiry);
//         return config;
//     };
//     console.warn("Session Clear: ", (expiration * 1000), "<", new Date().getTime());
//     return config;
// }, (err) => {
//     console.log("Error in Interceptor OuterLayer: >", err);
//     Promise.reject();
// });

export const RTFTemplate = `<h2 style="text-align: justify">Robert Conels</h2><p style="text-align: justify">
<strong>Place: NewYork,HIMA</strong></p><p style="text-align: justify"><strong>Age: 45</strong></p><p style="text-align: justify">
<strong>Diagnosis: oTrefRt</strong></p><p style="text-align: justify"><strong>Last Checkup: 04/11/2022</strong></p>
<p style="text-align: justify">
<p style="text-align: justify"><strong>Status: 4</strong></p><h4 style="text-align: justify"><strong>Primary Stage</strong>
</h4><ul><li><p style="text-align: justify"><strong>Diagnosed with TFRT</strong></p></li><li><p style="text-align: justify">
<strong>Started Treatment on 4th May</strong></p></li><li><p style="text-align: justify"><strong>Statuscode 6</strong></p></li>
</ul><h4 style="text-align: justify"><strong>Secondary Stage</strong></h4><ul><li><p style="text-align: justify">
<strong>Major progress</strong></p></li><li><p style="text-align: justify"><strong>Stauscode 2</strong></p></li>
<li><p style="text-align: justify">
<strong>Stage 5 Entered</strong></p></li><li><p style="text-align: justify"><strong>Decreased Medication </strong></p></li></ul>
<h4 style="text-align: justify"><strong>Tertiary Stage</strong></h4><ul><li><p style="text-align: justify">
<strong>Improved Health</strong></p>
</li><li><p style="text-align: justify"><strong>Statuscodes cleared</strong></p></li></ul><p style="text-align: justify"></p><hr>
<blockquote><p style="text-align: center">Discharged and cleared Case ! </p>
<p style="text-align: center">© 2022 <strong>medic-log</strong></p></blockquote>`;
