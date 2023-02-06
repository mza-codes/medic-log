import Session from "../models/Session.js";
import { log } from "./logger.js";

const cache = new Map();

class Client {
    set = async (key, val) => {
        log.warn("Assigning for: ", key, "\n DATA:", val);
        try {
            let doc = await Session.findOne({ key });
            log.info("DOC FIND: ", key, " Returned: ", doc);
            if (!doc) {
                log.warn("no DOC found for ", key);
                doc = await Session.create({ key, value: val });
                log.info("DOC SET: ", key, " Returned: ", doc);
            };
            doc.value = val;
            await doc.save();
            // if(
        } catch (err) {
            log.error("Error in CACHE Config SET: ", err);
            return null;
        };
        // cache.set(key, val);
        return true;
    };

    get = async (key) => {
        log.warn("Searching for: ", key);
        if (!key) return false;

        try {
            const doc = await Session.findOne({ key });
            log.info("DOC Query: ", key, " Returned: ", doc);
            return doc?.value ?? null;
        } catch (err) {
            log.error("Error in CACHE Config GET: ", err);
            return null;
        };
        // return cache.get(key);
    };
};

export const redisClient = new Client();

// export const redisClient = new Map();


