import create from 'zustand';
import { RTFTemplate } from '../Assets';

const initialState = {
    loading: false,
    editData: {},
    doc: "",
    personData: ""
};

const useLocalState = create((set, get) => ({
    ...initialState,

    setLoading: (bool = false) => {
        set(s => ({
            ...s,
            loading: bool
        }));
        return true;
    },
    setEditData: (data) => {
        set((s) => ({
            ...s,
            editData: data
        }));
        return true;
    },
    setData: (data) => {
        set((s) => ({
            ...s,
            doc: data ?? ""
        }));
        return true;
    },
    setState: (field, value) => {
        set((s) => ({
            ...s,
            [field]: value
        }));
        return true;
    },
    setPersonData: (value) => {
        set((s) => ({
            ...s,
            personData: value
        }));
        return true;
    },
}));

export default useLocalState;