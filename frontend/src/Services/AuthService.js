import create from 'zustand';

const initialState = {
    user: {},
    active: false,
    isLoading: false
};

const useAuthService = create((set) => ({
    ...initialState,

    login:() => {},
    logout:() => {},
    updateSession: () => {}
}));

export default useAuthService;