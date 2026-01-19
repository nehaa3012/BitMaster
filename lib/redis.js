import Redis from 'ioredis';

// Create Redis client instance
// Using singleton pattern to reuse the same connection across the app
let redis;

if (!global.redis) {
    const redisConfig = {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379', 10),
        maxRetriesPerRequest: 3,
        retryStrategy(times) {
            const delay = Math.min(times * 50, 2000);
            return delay;
        },
        // Reconnect on error
        reconnectOnError(err) {
            const targetError = 'READONLY';
            if (err.message.includes(targetError)) {
                // Only reconnect when the error contains "READONLY"
                return true;
            }
            return false;
        },
    };

    // Add password if provided
    if (process.env.REDIS_PASSWORD) {
        redisConfig.password = process.env.REDIS_PASSWORD;
    }

    global.redis = new Redis(redisConfig);

    // Event listeners for debugging
    global.redis.on('connect', () => {
        console.log('✅ Redis client connected');
    });

    global.redis.on('error', (err) => {
        console.error('❌ Redis client error:', err);
    });

    global.redis.on('ready', () => {
        console.log('✅ Redis client ready');
    });
}

redis = global.redis;

export default redis;

// Helper functions for common Redis operations
export const redisHelpers = {
    // Set a key with optional expiration (in seconds)
    async set(key, value, expirationInSeconds = null) {
        const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
        if (expirationInSeconds) {
            return await redis.setex(key, expirationInSeconds, stringValue);
        }
        return await redis.set(key, stringValue);
    },

    // Get a key and parse JSON if applicable
    async get(key) {
        const value = await redis.get(key);
        if (!value) return null;

        try {
            return JSON.parse(value);
        } catch {
            return value;
        }
    },

    // Delete one or more keys
    async del(...keys) {
        return await redis.del(...keys);
    },

    // Check if key exists
    async exists(key) {
        return await redis.exists(key);
    },

    // Set expiration on a key (in seconds)
    async expire(key, seconds) {
        return await redis.expire(key, seconds);
    },

    // Get all keys matching a pattern
    async keys(pattern) {
        return await redis.keys(pattern);
    },

    // Increment a counter
    async incr(key) {
        return await redis.incr(key);
    },

    // Decrement a counter
    async decr(key) {
        return await redis.decr(key);
    },

    // Hash operations
    async hset(key, field, value) {
        const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
        return await redis.hset(key, field, stringValue);
    },

    async hget(key, field) {
        const value = await redis.hget(key, field);
        if (!value) return null;

        try {
            return JSON.parse(value);
        } catch {
            return value;
        }
    },

    async hgetall(key) {
        return await redis.hgetall(key);
    },

    // List operations
    async lpush(key, ...values) {
        return await redis.lpush(key, ...values.map(v =>
            typeof v === 'string' ? v : JSON.stringify(v)
        ));
    },

    async rpush(key, ...values) {
        return await redis.rpush(key, ...values.map(v =>
            typeof v === 'string' ? v : JSON.stringify(v)
        ));
    },

    async lrange(key, start, stop) {
        const values = await redis.lrange(key, start, stop);
        return values.map(v => {
            try {
                return JSON.parse(v);
            } catch {
                return v;
            }
        });
    },

    // Set operations
    async sadd(key, ...members) {
        return await redis.sadd(key, ...members);
    },

    async smembers(key) {
        return await redis.smembers(key);
    },

    async sismember(key, member) {
        return await redis.sismember(key, member);
    },
};
