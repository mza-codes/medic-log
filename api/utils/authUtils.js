import ENV from "./validateEnv.js";
import jwt from "jsonwebtoken";
import { v4 as uuid } from "uuid";

export const userCookie = "_ga_medic_log_sess";
export const refreshCookie = `_ga_medic_log_refresh`;
export const deleteReqCookie = `_sa_medic_log_important`;

export const cookieConfig = {
    path: "/",
    expires: new Date(Date.now() + (1000 * 60) * 12),
    httpOnly: true,
    sameSite: ENV.SAME_SITE ?? "lax",
    secure: true
};

export const createAccessToken = (data) => {
    const newToken = jwt.sign(data, ENV.JWT_KEY, { expiresIn: "5m" });
    return newToken;
};

export const createRefreshToken = (data) => {
    const newToken = jwt.sign(data, ENV.JWT_REFRESH_KEY, { expiresIn: "4h" });
    return newToken;
};

export const genCookie = (res, name, token, options = {}) => {
    if (!res) throw new Error("res must be passed with genCookie!");
    return res.cookie(String(name), token, { ...cookieConfig, ...options });
};

export const CSRFKey = (id) => `${id}_csrf`;
export const genCSRFToken = () => uuid();