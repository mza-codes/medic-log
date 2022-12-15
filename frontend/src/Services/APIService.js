import create from 'zustand';
import { API } from '../Assets';

export let controller;

const initialState = {
    data: {
        document: ""
    },
    isLoading: false,
    error: {
        active: false
    },
    success: false,

};

const fetchData = async (request) => {
    try {
        const { data } = await request;
        return data;
    } catch (error) {
        console.error("Catched Error: >", error);
        return error;
    };
};

const useApiService = create((set, get) => ({
    ...initialState,
    startLoading: () => {
        set((state) => ({
            ...state,
            isLoading: true,
            success: false
        }));
        return true;
    },
    stopLoading: () => {
        set((state) => ({
            ...state,
            isLoading: false,
        }));
        return true;
    },
    setLoading: (boolean = false) => {
        set((state) => ({
            ...state,
            isLoading: boolean,
        }));
        return true;
    },
    handleError: (err) => {
        if (!err) return false;
        set((state) => ({
            ...state,
            error: {
                active: true,
                ...err
            },
            success: false,
            isLoading: false
        }));
        return true;
    },
    setDocument: (docData) => {
        console.log("Setting Document", docData);
        if (!docData) return false;
        set((s) => ({
            ...s,
            data: { document: docData },
            error: { active: false }
        }));
        return true;
    },
    setPayload: async (data) => {
        const doc = get().data.document;
        if (!data || !doc) {
            console.log("NO Data Found Doc: ", doc, "data: ", data);
            !doc && set((s) => ({ ...s, error: { ...s.error, active: true, message: "Patient Document must be filled & Confirmed !" } }));
            return false;
        };
        console.log("Final Payload :", { ...data, doc });
        set((s) => ({
            ...s,
            data: {
                ...s.data,
                ...data
            }
        }));
        return true;
    },
    handleSubmission: async () => {
        // @route /api/v1/app/add-data
        controller = new AbortController();
        const signal = controller.signal;
        const handleError = get().handleError;
        const setLoading = get().setLoading;
        const payload = get().data;
        if (!payload) {
            handleError({ active: true, message: "No Data Found, Please ReSubmit Form !" })
            return false;
        };
        setLoading(true);
        const data = await fetchData(API.post('/app/add-data', { ...payload }, { withCredentials: true, signal }));
        console.log("FETCHED DATA", data);

        if (data?.code) {
            handleError(data?.response?.data ?? data);
            return false;
        };
        if (data?.success) {
            set((s) => ({ ...s, success: true, isLoading: false }));
            return data?.success ?? true;
        } else {
            handleError({ message: "Unknown Error Occurred,Please Contact Vendor!" });
            console.log("FIX THIS IN APISERVICE.JS, data.code && data.success shows falsy values");
            return false;
        };
    },
}));

export default useApiService;