import create from 'zustand';
import axios from 'axios';

axios.defaults.withCredentials = true;
let cancel;

const initialState = {
    user: {},
    active: false,
    isLoading: false,
    error: {},
    info: {},
    errActive: false,
    userData: {},
    userToken: "",
    refreshToken: ""
};

const API = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    cancelToken: new axios.CancelToken((c) => cancel = c)
});

// const secureAPI = axios.create({
//     baseURL: process.env.REACT_APP_API_URL,
//     headers: {
//         authorization: `Bearer ${sessionTokens?.userToken}`
//     }
// });

const fetchData = async (request) => {
    try {
        const { data } = await request;
        return data;
    } catch (error) {
        console.error("Catched Error", error);
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
    login: async (loginData) => {
        console.log("data Loading");
        set(state => ({ ...state, isLoading: true, info: {}, errActive: false }));
        try {
            const { data, headers } = await API.post('/auth/login', loginData);
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
    register: async (signupData) => {
        set(state => ({ ...state, isLoading: true, info: {}, errActive: false }));
        try {
            const { data, headers } = await API.post('/auth/register', signupData);
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
        set(state => ({ ...state, isLoading: true, info: {}, userData: formData }));
        // try {
        // const { data } = await API.post('/auth/otpAuth', { email });
        const data = await fetchData(API.post('/auth/otpAuth', { email }));
        if (data?.success) {
            set((state) => ({
                ...state,
                info: data,
                isLoading: false,
                errActive: false
            }));
            return data;
        } else {
            // } catch (error) {
            let error = data;
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
    validateOtp: async ({ otp }) => {
        console.warn("Verifying Entered OTP:", otp);
        set(state => ({ ...state, isLoading: true, info: {}, errActive: false }));
        // try {
        // const { data } = await API.post('/auth/otpAuth/otpVerify', { otp }, { withCredentials: true });
        const data = await fetchData(API.post('/auth/otpAuth/otpVerify', { otp }, { withCredentials: true }));
        if (data?.success) {
            set((state) => ({
                ...state,
                info: data,
                isLoading: false,
                errActive: false
            }));
            return data;
        } else {
            // } catch (error) {
            let error = data;
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
}));

export default useAuthService;