import { log } from "./logger.js";

const cache = new Map();

class Client {
    set = async (key, val) => {
        log.warn("Assigning for: ",key,"\n DATA:",val);
        cache.set(key, val);
        return true;
    };

    get = async (key) => {
        log.warn("Searching for: ",key);

        if (!key) return false;
        return cache.get(key);
    };
};

export const redisClient = new Client();

// export const redisClient = new Map();


