import Redis from "ioredis";

/**
 * Create a global Redis instance (singleton)
 * This prevents multiple connections on Vercel / Next.js hot reload
 */
let redis;

if (!global.redis) {
  if (!process.env.REDIS_URL) {
    throw new Error("❌ REDIS_URL is not defined in environment variables");
  }

  global.redis = new Redis(process.env.REDIS_URL, {
    maxRetriesPerRequest: 3,
    retryStrategy(times) {
      const delay = Math.min(times * 50, 2000);
      return delay;
    },
  });

  // Debug logs
  global.redis.on("connect", () => {
    console.log("✅ Redis connected");
  });

  global.redis.on("ready", () => {
    console.log("✅ Redis ready");
  });

  global.redis.on("error", (err) => {
    console.error("❌ Redis error:", err);
  });
}

redis = global.redis;

export default redis;

/**
 * Helper functions for Redis operations
 */
export const redisHelpers = {
  async set(key, value, expirationInSeconds) {
    const stringValue =
      typeof value === "string" ? value : JSON.stringify(value);

    if (expirationInSeconds) {
      return redis.setex(key, expirationInSeconds, stringValue);
    }

    return redis.set(key, stringValue);
  },

  async get(key) {
    const value = await redis.get(key);
    if (!value) return null;

    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  },

  async del(...keys) {
    return redis.del(...keys);
  },

  async exists(key) {
    return redis.exists(key);
  },

  async expire(key, seconds) {
    return redis.expire(key, seconds);
  },

  async keys(pattern) {
    return redis.keys(pattern);
  },

  async incr(key) {
    return redis.incr(key);
  },

  async decr(key) {
    return redis.decr(key);
  },

  // Hash operations
  async hset(key, field, value) {
    const stringValue =
      typeof value === "string" ? value : JSON.stringify(value);
    return redis.hset(key, field, stringValue);
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
    return redis.hgetall(key);
  },

  // List operations
  async lpush(key, ...values) {
    return redis.lpush(
      key,
      ...values.map((v) =>
        typeof v === "string" ? v : JSON.stringify(v)
      )
    );
  },

  async rpush(key, ...values) {
    return redis.rpush(
      key,
      ...values.map((v) =>
        typeof v === "string" ? v : JSON.stringify(v)
      )
    );
  },

  async lrange(key, start, stop) {
    const values = await redis.lrange(key, start, stop);
    return values.map((v) => {
      try {
        return JSON.parse(v);
      } catch {
        return v;
      }
    });
  },

  // Set operations
  async sadd(key, ...members) {
    return redis.sadd(key, ...members);
  },

  async smembers(key) {
    return redis.smembers(key);
  },

  async sismember(key, member) {
    return redis.sismember(key, member);
  },
};
