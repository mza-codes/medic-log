export const genBody = (status, msg, payload) => {
    return {
        success: status ?? false,
        message: msg ?? "",
        ...payload
    };
};

export const genRes = async (res, code, status, msg, payload) => {
    if (!res || !code) throw new Error("res & code is required!");
    return res.status(code).json(
        genBody(status, msg, payload)
    );
};

export default genRes;