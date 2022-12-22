import create from 'zustand';

const initialState = {
    loading: false,
    editData: {}
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
}));

export default useLocalState;