import create from 'zustand';
import axios from 'axios';

let cancel;
console.warn("logging Cancel", cancel);

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

const fetchData = async (url) => {
    const { data } = await API.get(url);
    return data;
};

const useAuthService = create((set, get) => ({
    ...initialState,

    login: async (loginData) => {
        console.log("data Loading");
        set(state => ({ ...state, isLoading: true, info: {} }));
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
        set(state => ({ ...state, isLoading: true, info: {} }));
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
    generateOtp: async (data) => {
        const { email } = data;
        set(state => ({ ...state, isLoading: true, info: {}, userData: data }));
        try {
            const { data } = await API.post('/auth/otpAuth', { email });
            set((state) => ({
                ...state,
                info: data,
                isLoading: false,
                errActive: false
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
    validateOtp: async ({ otp }) => {
        console.warn("Verifying Entered OTP:", otp);
        set(state => ({ ...state, isLoading: true, info: {} }));
        try {
            const { data } = await API.post('/auth/otpAuth/otpVerify', { otp });
            set((state) => ({
                ...state,
                info: data,
                isLoading: false,
                errActive: false
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
}));

export default useAuthService;