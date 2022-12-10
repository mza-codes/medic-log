import create from 'zustand';
import axios from 'axios';

axios.defaults.withCredentials = true;
let controller;

const initialState = {
    user: {},
    active: false,
    isLoading: false,
    error: {},
    info: {},
    errActive: false,
    errSource: "",
    isCancelled: "",
    userData: {},
    userToken: "",
    refreshToken: ""
};

//30 seconds timeout set
const API = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    timeout: 1000 * 30
});

// const secureAPI = axios.create({
//     baseURL: process.env.REACT_APP_API_URL,
//     headers: {
//         authorization: `Bearer ${"sessionTokens?.userToken"}`
//     }
// });

const fetchData = async (request) => {
    try {
        const { data } = await request;
        return data;
    } catch (error) {
        // console.error("Catched Error", error);
        return error;
    };
};

const useAuthService = create((set, get) => ({
    ...initialState,
    hideError: () => {
        set((state) => ({
            ...state,
            errActive: false
        }));
        return;
    },
    cancelReq: () => {
        console.log("Cancel Req called from hook,Prinitng controller: ", controller);
        controller?.abort("User Cancelled Request using hook");
        set(state => ({ ...state, isLoading: false, isCancelled: "Request Cancelled !" }));
        return;
    },
    login: async (loginData) => {
        console.log("data Loading");
        set(state => ({ ...state, isLoading: true, info: {}, errActive: false, isCancelled: "" }));
        controller = new AbortController();
        try {
            const { data, headers } = await API.post('/auth/login', loginData, { signal: controller.signal });
            const { user_token } = headers;
            console.log("logging data", data, "<<<DATA || HEADERS >>>", user_token);

            set(state => ({
                ...state,
                user: data?.user,
                active: true,
                isLoading: false,
                errActive: false,
                userToken: user_token,
                refreshToken: data.refreshToken
            }));
            return data;
        } catch (error) {
            set((state) => ({
                ...state,
                errSource: "login",
                error: { ...error?.response?.data ?? error },
                isLoading: false,
                errActive: true,
                userToken: "",
                refreshToken: ""
            }));
            return error;
        };
    },
    logout: async () => {
        // Case
    },
    updateSession: async (tokens) => {
        try {
            const { data, headers } = await API.post('/auth/refresh-token', {
                ...tokens
            });
            const { user_token } = headers;
            set(state => ({
                ...state,
                active: true,
                isLoading: false,
                errActive: false,
                userToken: user_token,
                refreshToken: data.refreshToken
            }));
            return data;
        } catch (error) {
            console.warn(error);
            set((state) => ({
                ...state,
                error: { ...error?.response?.data ?? error },
                isLoading: false,
                errActive: true,
                userToken: "",
                refreshToken: ""
            }));
            return error;
        };
    },
    register: async () => {
        controller = new AbortController();
        set(state => ({ ...state, isLoading: true, info: {}, errActive: false, isCancelled: "" }));
        const { userData: signupData } = get();
        console.log("Printing SignupData: >> from Register req", signupData);
        if (!signupData?.email) {
            //Case here add error
            console.log("No userData found");
            set(state => ({
                ...state,
                isLoading: false,
                info: {},
                errActive: true,
                errSource: "verify",
                error: { message: "No UserData Found,Please Try Signing Up Again !" },
                isCancelled: ""
            }));
            return false;
        };
        try {
            const { data, headers } = await API.post('/auth/register', signupData, {
                signal: controller.signal, withCredentials: true
            });
            const { user_token } = headers;
            console.log("logging data", data, "<<<DATA || HEADERS >>>", user_token);

            set(state => ({
                ...state,
                user: data?.user,
                active: true,
                isLoading: false,
                errActive: false,
                userToken: user_token,
                refreshToken: data.refreshToken
            }));
            return data;
        } catch (error) {
            console.warn(error);
            set((state) => ({
                ...state,
                errSource: "signup",
                error: { ...error?.response?.data ?? error },
                isLoading: false,
                errActive: true,
                userToken: "",
                refreshToken: ""
            }));
            return error;
        };
    },
    generateOtp: async (formData) => {
        const { email } = formData;
        controller = new AbortController();
        const signal = controller.signal;
        set(state => ({ ...state, isLoading: true, info: {}, userData: formData }));

        const data = await fetchData(API.post('/auth/otpAuth', { email }, { signal }));
        if (data?.success) {
            set((state) => ({
                ...state,
                info: data,
                isLoading: false,
                errActive: false
            }));
            return data;
        } else {
            let error = data;
            console.warn(error);
            set((state) => ({
                ...state,
                errSource: "signup",
                error: { ...error?.response?.data ?? error },
                isLoading: false,
                errActive: true,
                userToken: "",
                refreshToken: ""
            }));
            return error;
        };
    },
    validateOtp: async ({ otp }) => {
        console.warn("Verifying Entered OTP:", otp);
        set(state => ({ ...state, isLoading: true, info: {}, errActive: false, isCancelled: "" }));

        controller = new AbortController();
        const data = await fetchData(API.post('/auth/otpAuth/otpVerify', { otp }, {
            withCredentials: true, signal: controller.signal
        }));

        if (data?.success) {
            const { userData } = get();
            if (!userData?.email) {
                //Case here add error
                console.warn("No userData found");
                set(state => ({
                    ...state,
                    isLoading: false,
                    info: data,
                    errSource: "verify",
                    errActive: true,
                    error: { message: "No UserData Found,Please Try Signing Up Again !" },
                    isCancelled: ""
                }));
                return { success: false, message: "No UserData Found !" };
            };
            set((state) => ({
                ...state,
                info: data,
                isLoading: false,
                errActive: false
            }));
            return data;
        } else {
            let error = data;
            console.warn(error);
            set((state) => ({
                ...state,
                errSource: "verify",
                error: { ...error?.response?.data ?? error },
                isLoading: false,
                errActive: true,
                userToken: "",
                refreshToken: ""
            }));
            return error;
        };
    },
}));

export default useAuthService;