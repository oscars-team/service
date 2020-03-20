import { Service } from 'egg';

export default class RedisService extends Service {

    async set(key: string, value: any, seconds?: number) {
        const { redis } = this.app;
        if (!key) throw `invalid cache key:  ${key}`
        if (typeof value === 'object') value = JSON.stringify(value);
        if (!seconds)
            await redis.set(key, value);
        else
            await redis.set(key, value, 'EX', seconds)
    }

    async getObject(key) {
        if (!key) throw `invalid cache key:  ${key}`
        const { redis } = this.app;
        let data = await redis.get(key);
        if (!data) return undefined;
        return JSON.parse(data);
    }

    async get(key) {
        if (!key) throw `invalid cache key:  ${key}`
        const { redis } = this.app;
        return await redis.get(key);
    }

    async flushall() {
        const { redis } = this.app;
        redis.flushall();
        return;
    }

}