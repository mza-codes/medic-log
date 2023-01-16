export const hook = (field, hook) => {
    return hook((state) => state[field]);
};