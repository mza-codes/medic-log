import create from 'zustand';
import { SecureAPI } from '../Assets';
import { fetchData } from './AuthService';

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
    // Records
    patientRecords: [],
};

const genSignal = () => {
    controller = new AbortController();
    return controller.signal;
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
    setErrorView: (bool) => {
        set((s) => ({
            ...s,
            error: {
                ...s.error,
                active: bool ?? false,
            }
        }))
    },
    handleError: (err) => {
        if (!err) return false;
        set((state) => ({
            ...state,
            error: {
                ...err,
                active: true,
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
            if (!doc) {
                set((s) => ({
                    ...s, error: {
                        ...s.error,
                        active: true,
                        message: "Patient Document must be filled & Confirmed !"
                    }
                }));
                return false;
            };
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
    setRecords: (data) => {
        set((s) => ({
            ...s,
            patientRecords: data?.records ?? [],
            error: {
                ...s.error,
                active: !data?.success ?? false,
            }
        }));
        return true;
    },
    handleSubmission: async (update, recordId) => {
        // if (update === 1) return console.warn("It's an Update");
        // else return console.warn("I's adding Data");
        // @route /api/v1/app/add-data
        controller = new AbortController();
        const signal = controller.signal;
        const handleError = get().handleError;
        const setLoading = get().setLoading;
        const payload = get().data;
        if (!payload) {
            handleError({ active: true, message: "No Data Found, Please ReSubmit Form !" });
            return false;
        };
        setLoading(true);
        let data;
        if (update === 1 && recordId) {
            data = await fetchData(SecureAPI.put(`/app/update-record/${recordId}`,
                { ...payload },
                { withCredentials: true, signal }));
        } else {
            data = await fetchData(SecureAPI.post('/app/add-data',
                { ...payload },
                { withCredentials: true, signal }));
        };
        console.log("FETCHED DATA", data);

        if (data?.code) {
            handleError(data?.response?.data ?? data);
            return false;
        };
        if (data?.success) {
            set((s) => ({ ...s, success: true, isLoading: false }));
            return data?.success ?? true;
        } else { // failure prevention
            handleError({ message: "Unknown Error Occurred,Please Contact Vendor!" });
            console.log("FIX THIS IN APISERVICE.JS, data.code && data.success shows falsy values");
            return false;
        };
    },
    getRecords: async (signal) => {
        console.warn("fetching Records");
        get().setLoading(true);
        const data = await fetchData(SecureAPI.get('/app/get-all-records', { withCredentials: true, signal }));
        console.log("getRecords Data", data);
        if (data?.code) {
            get().handleError(data?.response?.data ?? data);
            return false;
        };
        set((s) => ({
            ...s,
            patientRecords: data?.records ?? [],
            isLoading: false
        }));
        get().setErrorView(false);
        return true;
    },
    searchRecords: async (query) => {
        get().setLoading(true);
        controller = new AbortController();
        const signal = controller.signal;
        const data = await fetchData(SecureAPI.get(`/app/search-records/?query=${query}`,
            { withCredentials: true, signal }
        ));
        get().setLoading(false);
        console.warn("Fetched for Query: ", query, ">>", data);
        if (data?.code) {
            get().handleError(data?.response?.data ?? data);
            return false;
        };
        get().setRecords(data);
        get().setErrorView(false);
        return data;
    },
    deleteRecordWAuth: async (id) => {
        console.warn("Delete by id",id);
        get().setLoading(true);
        const data = await fetchData(SecureAPI.delete(`/app/delete-record/${id}`, {
            withCredentials: true,
            signal: genSignal()
        }));
        get().setLoading(false);
        if (data?.code) {
            get().handleError(data?.response?.data ?? data);
            return false;
        };
        if (data?.success) {
            get().setErrorView(false);
            console.warn("Response from Actual Delete Request", data);
            return true;
        };
        return;
    },
    deleteRecord: async (id, password) => {
        if (!id || !password) return get().handleError({ message: "Record ID & Password required to proceed!" });
        get().setLoading(true);
        const data = await fetchData(SecureAPI.post(`/app/delete-record/${id}/authenticate`, { password }, {
            withCredentials: true,
            signal: genSignal()
        }));
        console.warn("Rsponse from DeleteRecord Request", data);
        // get().setLoading(false);

        if (data?.code) {
            console.warn("data.code found handling Error");
            get().handleError(data?.response?.data ?? data);
            return false;
        };
        if (data?.success) {
            console.warn("data.success found calling func");
            get().setErrorView(false);
            const status = await get().deleteRecordWAuth(id);
            return status;
        };
        return;
    },
}));

export default useApiService;