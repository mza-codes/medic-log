import create from 'zustand';
import { API, SecureAPI } from '../Assets';

let controller;
let errToast;

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
    refreshToken: "",
    serverConnected: false,
};

const genSignal = () => {
    controller = new AbortController();
    return controller.signal;
};

export const fetchData = async (request) => {
    try {
        const { data } = await request;
        return data;
    } catch (error) {
        if (error.code === "ECONNABORTED") {
            console.warn("Timeout");
            errToast.current.style.visibility = "visible";
        };
        if (error?.response?.data?.message === "jwt expired") {
            error.expired = true;
            error.response.data.message = "Session Expired,Please Login!";
        };
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
    setUser: (userData) => {
        set((s) => ({
            ...s,
            user: userData,
            active: true
        }));
        return true;
    },
    handleError: (error) => {
        set((s) => ({
            ...s,
            errActive: true,
            error: { ...error },
        }));
        return true;
    },
    cancelReq: () => {
        controller?.abort("User Cancelled Request using hook");
        set(state => ({ ...state, isLoading: false, isCancelled: "Request Cancelled !" }));
        return;
    },
    setLoading: (action) => {
        set((s) => ({
            ...s, isLoading: action ?? true,
        }));
        return true;
    },
    refreshSession: async () => {
        if (get().active) {
            const data = await fetchData(SecureAPI.post('/auth/refresh-session', {}, {
                withCredentials: true, signal: genSignal()
            }));
            if (data?.code) {
                set(s => ({
                    ...s,
                    active: false,
                    user: {},
                    errActive: false
                }));
                return false;
            };
            return true;
        };
        return false;
    },
    login: async (loginData) => {
        set(state => ({ ...state, isLoading: true, info: {}, errActive: false, isCancelled: "" }));
        controller = new AbortController();
        try {
            const { data, headers: { user_token } } = await API.post('/auth/login', loginData, { signal: controller.signal });
            localStorage.setItem("expiration", data?.expiry);
            set(state => ({
                ...state,
                user: data?.user,
                active: true,
                isLoading: false,
                errActive: false,
                userToken: user_token,
                refreshToken: data?.refreshToken,
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
        get().setLoading(true);
        const data = await fetchData(SecureAPI.get('/auth/logout', { withCredentials: true, signal: genSignal() }));
        if (data?.code) {
            get().handleError(data?.response?.data ?? data);
            return false;
        };
        set((s) => ({
            ...s,
            user: {},
            active: false,
            isLoading: false
        }));
        return true;
    },
    verifySession: async (signal, errMsg) => {
        errToast = errMsg;
        const setUser = get().setUser;
        const setLoading = get().setLoading;

        setLoading(true);
        await API.get('/auth/verifyUser', {
            withCredentials: true, signal
        }).then((res) => {
            setLoading(false);
            setUser(res?.data?.user);
            return set((s) => ({ ...s, serverConnected: true }));
        }).catch((err) => {
            setLoading(false);
            if (err.code === "ECONNABORTED") {
                errMsg.current.style.visibility = "visible";
                return set((s) => ({ ...s, serverConnected: false }));
            };
            return set((s) => ({ ...s, serverConnected: true }));
        });
        return;
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
        if (!signupData?.email) {
            //Case here add error
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
            localStorage.setItem("expiration", data?.expiry);
            const { user_token } = headers;

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
        set(state => ({ ...state, isLoading: true, info: {}, errActive: false, isCancelled: "" }));

        controller = new AbortController();
        const data = await fetchData(API.post('/auth/otpAuth/otpVerify', { otp }, {
            withCredentials: true, signal: controller.signal
        }));

        if (data?.success) {
            const { userData } = get();
            if (!userData?.email) {
                //Case here add error
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
    updateProfile: async (formData) => {
        get().setLoading(true);
        try {
            const { data } = await SecureAPI.put('/user/update', formData, { signal: genSignal() });
            console.log("updateProfile Response", data);
            set(state => ({
                ...state,
                user: data?.user,
                errActive: false
            }));
            return data;
        } catch (error) {
            console.log(error);
            get().handleError(error?.response?.data ?? error);
        } finally {
            get().setLoading(false);
        };
    },
}));

export default useAuthService;