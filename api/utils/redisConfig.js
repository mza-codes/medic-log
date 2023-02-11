import Session from "../models/Session.js";
import { log } from "./logger.js";

const cache = new Map();

class Client {
    set = async (key, val) => {
        try {
            const doc = await Session.findOne({ key });
            if (!doc) {
                const document = await Session.create({ key, value: val });
                cache.set(key, document?.value);
                return true;
            };
            doc.value = val;
            await doc.save();
            cache.set(key, doc?.value);
            return true;
        } catch (err) {
            log.error("Error in CACHE Config SET: ", err);
            return null;
        };
    };

    get = async (key) => {
        if (!key) return false;
        const res = cache.get(key);
        if (res) return res;

        try {
            log.warn("Getting DOC from DB: ", key);
            const doc = await Session.findOne({ key });
            cache.set(key, doc?.value);
            return doc?.value ?? null;
        } catch (err) {
            log.error("Error in CACHE GET: ", err);
            return null;
        };
    };

    del = async (key) => {
        try {
            await Session.findOneAndRemove({ key });
            return true;
        } catch (err) {
            log.error("Error in Cache.Del: ", err);
            return false;
        };
    };
};

export const redisClient = new Client();

// export const redisClient = new Map();


