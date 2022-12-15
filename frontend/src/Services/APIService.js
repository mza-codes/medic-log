import create from 'zustand';

let controller;
const initialState = {
    data: {
        document: ""
    },
    isLoading: false,
    error: {
        active: false
    },
    success: false
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
    handleError: (err) => {
        if (!err) return false;
        set((state) => ({
            ...state,
            error: {
                active: true,
                ...err
            },
            success: false
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
    setPayload: (data) => {
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
    },
    handleSubmission: () => {
        // case
        controller = new AbortController();
    },
}));

export default useApiService;