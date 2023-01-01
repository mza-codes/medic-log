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
        // @route /api/v1/app/add-data
        const payload = get().data;
        if (!payload) {
            get().handleError({ active: true, message: "No Data Found, Please ReSubmit Form !" });
            return false;
        };
        get().setLoading(true);
        let data;
        if (update === 1 && recordId) {
            data = await fetchData(SecureAPI.put(`/app/update-record/${recordId}`,
                { ...payload },
                { signal: genSignal() }));
        } else {
            data = await fetchData(SecureAPI.post('/app/add-data',
                { ...payload },
                { signal: genSignal() }));
        };

        if (data?.code) {
            get().handleError(data?.response?.data ?? data);
            return false;
        };
        if (data?.success) {
            set((s) => ({ ...s, success: true, isLoading: false }));
            return data?.success ?? true;
        } else { // failure prevention
            get().handleError({ message: "Unknown Error Occurred,Please Contact Vendor!" });
            return false;
        };
    },
    getRecords: async (signal) => {
        get().setLoading(true);
        const data = await fetchData(SecureAPI.get('/app/get-all-records', { signal }));
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
        // return;
        const data = await fetchData(SecureAPI.get(`/app/search-records/?query=${query}`,
            { signal: genSignal() }
        ));
        get().setLoading(false);
        if (data?.code) {
            get().handleError(data?.response?.data ?? data);
            return false;
        };
        get().setRecords(data);
        get().setErrorView(false);
        return data;
    },
    deleteRecordWAuth: async (id) => {
        get().setLoading(true);
        const data = await fetchData(SecureAPI.delete(`/app/delete-record/${id}`, {
            signal: genSignal()
        }));
        get().setLoading(false);
        if (data?.code) {
            get().handleError(data?.response?.data ?? data);
            return false;
        };
        if (data?.success) {
            get().setErrorView(false);
            return true;
        };
        return;
    },
    deleteRecord: async (id, password) => {
        if (!id || !password) return get().handleError({ message: "Record ID & Password required to proceed!" });
        get().setLoading(true);
        const data = await fetchData(SecureAPI.post(`/app/delete-record/${id}/authenticate`, { password }, {
            signal: genSignal()
        }));

        if (data?.code) {
            get().handleError(data?.response?.data ?? data);
            return false;
        };
        if (data?.success) {
            get().setErrorView(false);
            const status = await get().deleteRecordWAuth(id);
            return status;
        };
        return;
    },
    testFunc: async () => {
        // const data = await PrivateFetch(get('/api/'))
    },
}));

export default useApiService;