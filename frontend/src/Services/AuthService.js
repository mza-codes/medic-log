import create from 'zustand';
import { API, SecureAPI } from '../Assets';

// axios.defaults.withCredentials = true;
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
    refreshToken: "",
    serverConnected: false,
};

const genSignal = () => {
    controller = new AbortController();
    return controller.signal;
};

// const secureAPI = axios.create({
//     baseURL: process.env.REACT_APP_API_URL,
//     headers: {
//         authorization: `Bearer ${"sessionTokens?.userToken"}`
//     }
// });

export const fetchData = async (request) => {
    try {
        const { data } = await request;
        return data;
    } catch (error) {
        // console.error("Catched Error", error);
        if (error?.response?.data?.message === "jwt expired") {
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
            ...error,
        }));
        return true;
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
            const { data, headers: { user_token } } = await API.post('/auth/login', loginData, { signal: controller.signal });
            console.log("logging data", data, "<<<DATA || HEADERS >>>", user_token);

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
        const signal = genSignal();
        const data = await fetchData(SecureAPI.get('/auth/logout', { withCredentials: true, signal }));
        if (data?.code) return get().handleError(data?.response?.data ?? data);
        set((s) => ({
            ...s,
            user: {},
            active: false
        }));
        return true;
    },
    setLoading: (action = true) => {
        set((s) => ({
            ...s, isLoading: action,
        }));
        return true;
    },
    verifySession: async (signal, errMsg) => {
        console.warn("Fetching Session ie verifiy session");
        const setUser = get().setUser;
        const setLoading = get().setLoading;

        setLoading(true);
        await API.get('/auth/verifyUser', {
            withCredentials: true, signal
        }).then((res) => {
            setLoading(false);
            console.log("Verifyuser returned success", res);
            setUser(res?.data?.user);
            return set((s) => ({ ...s, serverConnected: true }));
        }).catch((err) => {
            setLoading(false);
            if (err.code === "ECONNABORTED") {
                console.warn("Timeout");
                errMsg.current.style.visibility = "visible";
                return set((s) => ({ ...s, serverConnected: false }));
            };
            console.log("error Veriffying user: ", err);
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