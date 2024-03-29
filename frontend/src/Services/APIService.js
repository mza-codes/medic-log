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
    info: null,
    // Records
    patientRecords: [],
    patientRecord: null,
    adminData: {
        otps: [],
        records: [],
        sessions: [],
        users: []
    }
};

/** otps
: 
(18) [{…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}]
records
: 
(29) [{…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}]
sessions
: 
(19) [{…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}]
users
 */

export const validateStr = {
    isNum: /^\d+\.?\d*$/,
    isWord: /^[a-zA-Z][a-zA-Z ]*$/,
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
                message: ""
            }
        }))
    },
    setInfo: (data) => {
        set((s) => ({
            ...s,
            info: {
                active: true,
                ...data
            }
        }));
        return true;
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
    setStateData: (data) => {
        set((s) => ({
            ...s,
            ...data
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
            isLoading: false,
            info: { active: false }
        }));
        get().setErrorView(false);
        return true;
    },
    searchRecords: async (query) => {
        get().setLoading(true);
        const data = await fetchData(SecureAPI.get(`/app/search-records/?query=${query}`,
            { signal: genSignal() }
        ));
        if (data?.code) {
            get().handleError(data?.response?.data ?? data);
            return false;
        } else {
            get().setRecords(data);
            get().setInfo(data);
            get().setErrorView(false);
        };
        get().setLoading(false);
        return data;
    },
    searchRecordsV2: async (q, form) => {
        get().setLoading(true);
        form?.classList?.remove("errForm");
        const asc = q?.sortBy === "on";
        let data;
        if (q.sortfield?.toLowerCase() === "age") {
            const isNum = validateStr.isNum.test(q.query);
            if (!isNum) {
                form?.classList?.add("errForm");
                get().handleError({ message: "Query must be a number for field age!" });
                return false;
            };
            data = await fetchData(SecureAPI.get(
                `/app/search-records-v2/?${q?.sortfield + `[${asc ? "$lte" : "$gte"}]`}=${q.query}&sort=${asc ? q.sortfield : "-" + q.sortfield}`,
                { signal: genSignal() }
            ));
        } else if (q.sortfield?.toLowerCase() === "lastcheckup") {
            data = await fetchData(SecureAPI.get(
                `/app/search-records-v2/?${q?.sortfield}=${q.query}&sort=${asc ? q.sortfield : "-" + q.sortfield}`,
                { signal: genSignal() }));
            // return false;
        } else {
            data = await fetchData(SecureAPI.get(
                `/app/search-records-v2/?field=${q?.sortfield}&value=${q.query}&sort=${asc ? q.sortfield : "-" + q.sortfield}`,
                { signal: genSignal() }
            ));
        };
        get().setLoading(false);
        if (data?.code) {
            form?.classList?.add("errForm");
            get().setInfo({ active: false });
            get().handleError(data?.response?.data ?? data);
            return false;
        };
        get().setRecords(data);
        get().setInfo({ message: data?.message ?? "Results Found for Query" + q.query, active: true });
        get().setErrorView(false);
        return true;
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
        const data = await fetchData(SecureAPI.put(`/app/delete-record/${id}/authenticate`, { password }, {
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
    fetchRecord: async (id, signal) => {
        get().setLoading(true);
        const data = await fetchData(SecureAPI.get(`/app/get-record/${id}`, { signal }));
        get().setLoading(false);
        if (data?.code) {
            get().handleError(data?.response?.data ?? data ?? { message: `Could'nt fetch Record with ID ${id}` });
            return false;
        };
        set((s) => ({ ...s, patientRecord: data?.record }));
        return data;
    },
    getAdminData: async () => {
        get().setLoading(true);
        try {
            const { data } = await SecureAPI.put(`/super-user/get-data`, {}, { signal: genSignal() });
            console.warn("Got ADMIN DATA: ", data);
            get().setStateData({
                adminData: { ...data }
            });
        } catch (err) {
            console.error("Error in getAdminData", err);
            get().handleError(err?.response?.data ?? err ?? { message: "Error Getting Data!" });
        } finally {
            get().setLoading(false);
        };
        return;
    },
    testFunc: async () => {
        // const data = await PrivateFetch(get('/api/'))
    },
}));

export default useApiService;