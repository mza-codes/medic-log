import create from 'zustand';
import { API, SecureAPI } from '../Assets';

let controller;
export let errToast;

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
    email: ""
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
    resetState: () => {
        set(s => ({
            ...initialState,
            serverConnected: s.serverConnected,
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
    handleAuthError: (source = "", error) => {
        set((s) => ({
            ...s,
            errActive: true,
            errSource: source,
            error: {
                active: true,
                ...error
            },
            info: null
        }));
        return false;
    },
    handleError: (error) => {
        set((s) => ({
            ...s,
            errActive: true,
            error: {
                active: true,
                ...error
            },
            info: null
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
    setInfo: (data) => {
        set((s) => ({
            ...s,
            info: data,
            error: {}
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
        const data = await fetchData(SecureAPI.get('/auth/logout', { signal: genSignal() }));
        if (data?.code) {
            get().handleError(data?.response?.data ?? data);
            return false;
        };
        // setTimeout(() => {
        get().resetState();
        return true;
        // }, 6 * 1000);
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
            const { data, headers: { user_token } } = await API.post('/auth/register', signupData, {
                signal: genSignal(), withCredentials: true
            });
            localStorage.setItem("expiration", data?.expiry);
            set(state => ({
                ...state,
                user: data?.user,
                active: true,
                isLoading: false,
                errActive: false,
                userToken: user_token,
                refreshToken: data?.refreshToken
            }));
            return data;
        } catch (error) {
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
    generateOtp: async (formData) => {
        const { email } = formData;
        controller = new AbortController();
        const signal = controller.signal;
        set(state => ({ ...state, isLoading: true, info: {}, userData: formData }));

        const data = await fetchData(API.put('/auth/otpAuth', { email }, { signal }));
        if (data?.success) {
            set((state) => ({
                ...state,
                info: data,
                isLoading: false,
                errActive: false,
                error: null
            }));
            return data;
        } else {
            let error = data;
            set((state) => ({
                ...state,
                errSource: "signup",
                error: { ...error?.response?.data ?? error, active: true },
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
                error: null,
                isLoading: false,
                errActive: false
            }));
            return data;
        } else {
            let error = data;
            set((state) => ({
                ...state,
                errSource: "verify",
                error: { ...error?.response?.data ?? error, active: true },
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
        let response = false;
        try {
            const { data } = await SecureAPI.put('/user/update', formData, { signal: genSignal() });
            console.log("updateProfile Response", data);
            set(state => ({
                ...state,
                user: data?.user,
                errActive: false,
                info: data,
                error: null
            }));
            response = true;
        } catch (error) {
            console.log(error);
            get().handleError(error?.response?.data ?? error);
            response = false;
        } finally {
            get().setLoading(false);
            return response;
        };
    },
    forgotPwd: async (formData) => {
        get().setLoading(true);
        let status = false;
        try {
            const { data } = await API.put('/auth/forgot-password', formData, { signal: genSignal() });
            console.log("ForgotPwd Req Response: ", data);
            set((s) => ({
                ...s,
                info: data,
                email: formData.email,
                error: {}
            }));
            status = true;
        } catch (error) {
            console.log("Error in forgotPwd Req", error);
            get().handleError(error?.response?.data ?? error);
            status = false;
        } finally {
            get().setLoading(false);
            return status;
        };
    },
    verifyOTPforPwd: async (formData) => {
        get().setLoading(true);
        let response = false;
        try {
            const { data } = await API.put('/auth/verify-otp', { ...formData, email: get().email }, { signal: genSignal() });
            console.log("verifyOTPforPwd Req Response: ", data);
            get().setInfo(data);
            response = true;
        } catch (error) {
            get().handleError(error?.response?.data ?? error);
        } finally {
            get().setLoading(false);
            return response;
        };
    },
    updatePassword: async (formData) => {
        get().setLoading(true);
        let response = false;
        try {
            const { data } = await API.put('/auth/update-password', { ...formData, email: get().email }, { signal: genSignal() });
            console.log("updatePassword Req Response: ", data);
            get().setInfo(data);
            response = true;
        } catch (error) {
            get().handleError(error?.response?.data ?? error);
        } finally {
            get().setLoading(false);
            return response;
        };
    },
    updatePwdWAuth: async (formData) => {
        get().setLoading(true);
        let response = false;
        try {
            const { data } = await SecureAPI.put('/user/update-password', formData, { signal: genSignal() });
            get().setInfo(data);
            response = true;
        } catch (error) {
            get().handleError(error?.response?.data ?? error);
            response = false;
        } finally {
            get().setLoading(false);
            return response;
        };
    },
    resendOtp: async () => {
        const email = get()?.userData?.email;
        if (!email)
            return get().handleAuthError("verify", { message: "User's Email not found!" });
        get().setLoading(true);
        let response = false;
        try {
            const { data } = await API.put('/auth/otpAuth', { email }, { signal: genSignal() });
            const msg = data?.message?.replace("sent", "Resent");
            get().setInfo({ ...data, message: msg });
            response = true;
        } catch (error) {
            get().handleAuthError("verify", error?.response?.data ?? error);
            response = false;
        } finally {
            get().setLoading(false);
        };
        return response;
    },
}));

export default useAuthService;