const base64 = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;

export const decodeBody = async (req, res, next) => {
    if (req.method === "POST" || req.method === "PUT") {
        const data = req.body;
        for (let x in data) {
            let isEncoded = base64.test(data[x]);
            if (isEncoded) {
                const decoded = Buffer.from(data[x], "base64").toString();
                data[x] = decoded;
            };
        };
        req.body = { ...data };
    };
    return next();
};