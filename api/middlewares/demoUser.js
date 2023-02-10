import genRes from "../utils/JSONResponse.js";

const demoUser = `63c116d6204fad19afaa4710`;
const demoUserEmail = `demo@medic-log.org`;

export const preventUpdate = (req, res, next) => {
    if (req?.userId === demoUser || req?.email === demoUserEmail) {
        return genRes(res, 403, false, "Permissions are Limited for Demo User!");
    } else next();
};