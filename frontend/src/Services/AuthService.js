import create from 'zustand';
import axios from 'axios';

let cancel;
console.warn("logging Cancel", cancel);

const initialState = {
    user: {},
    active: false,
    isLoading: false,
    error: {},
    errActive: false
};

const API = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    cancelToken: new axios.CancelToken((c) => cancel = c)
});

const secureAPI = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    headers: {
        authorization: `Bearer ${"userToken"}`
    }
});

const fetchData = async (url) => {
    const { data } = await API.get(url);
    return data;
};

const useAuthService = create((set) => ({
    ...initialState,

    login: async (loginData) => {
        console.log("data Loading");
        set(state => ({ ...state, isLoading: true }));
        try {
            const { data, headers } = await API.post('/auth/login', loginData);
            const { user_token } = headers;
            console.log("logging data", data, "<<<DATA || HEADERS >>>", user_token);
            set(state => ({
                ...state,
                user: data?.user,
                active: true,
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
                errActive: true
            }));
            return error;
        };
    },
    logout: async () => {

    },
    updateSession: async () => {

    }
}));

export default useAuthService;