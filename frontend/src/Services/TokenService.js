import create from "zustand";

const initialState = {
    userToken: "",
    refreshToken: "",
    isValid: false
};

const useTokenService = create((set) => ({
    ...initialState,

    setToken: (userToken, refreshToken) => {
        console.warn("got token,", userToken, refreshToken);
        set((state) => ({
            ...state,
            userToken: userToken,
            refreshToken: refreshToken
        }));
        return true;
    },
    setTokenNew: (tokens) => {
        console.warn("got token,", tokens);
        set((state) => ({
            ...state,
            ...tokens,
            isValid: true
        }));
        return true;
    },
    // updateToken: (userToken, refreshToken)
}));

export default useTokenService;