/**
 * Example usage of Redis client
 * 
 * This file demonstrates how to use the Redis client in your application.
 * You can import and use these patterns in your API routes or server-side code.
 */

import redis, { redisHelpers } from './redis';

// Example 1: Basic key-value operations
export async function basicExample() {
    // Set a simple string
    await redisHelpers.set('user:name', 'John Doe');

    // Get the value
    const name = await redisHelpers.get('user:name');
    console.log('Name:', name);

    // Set with expiration (cache for 60 seconds)
    await redisHelpers.set('session:token', 'abc123', 60);

    // Check if key exists
    const exists = await redisHelpers.exists('user:name');
    console.log('Key exists:', exists);

    // Delete a key
    await redisHelpers.del('user:name');
}

// Example 2: Storing JSON objects
export async function jsonExample() {
    const user = {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
    };

    // Store object (automatically stringified)
    await redisHelpers.set('user:1', user);

    // Retrieve object (automatically parsed)
    const retrievedUser = await redisHelpers.get('user:1');
    console.log('User:', retrievedUser);
}

// Example 3: Counter operations
export async function counterExample() {
    // Increment a counter
    await redisHelpers.incr('page:views');
    await redisHelpers.incr('page:views');

    const views = await redisHelpers.get('page:views');
    console.log('Page views:', views);

    // Decrement
    await redisHelpers.decr('page:views');
}

// Example 4: Hash operations (for storing objects with fields)
export async function hashExample() {
    // Store user data in a hash
    await redisHelpers.hset('user:1000', 'name', 'Jane Doe');
    await redisHelpers.hset('user:1000', 'email', 'jane@example.com');
    await redisHelpers.hset('user:1000', 'age', 25);

    // Get a specific field
    const email = await redisHelpers.hget('user:1000', 'email');
    console.log('Email:', email);

    // Get all fields
    const userData = await redisHelpers.hgetall('user:1000');
    console.log('User data:', userData);
}

// Example 5: List operations (for queues, recent items, etc.)
export async function listExample() {
    // Add items to a list (left push)
    await redisHelpers.lpush('recent:problems', 'problem:1', 'problem:2');

    // Add items to the right
    await redisHelpers.rpush('recent:problems', 'problem:3');

    // Get all items
    const problems = await redisHelpers.lrange('recent:problems', 0, -1);
    console.log('Recent problems:', problems);
}

// Example 6: Set operations (for unique collections)
export async function setExample() {
    // Add members to a set
    await redisHelpers.sadd('solved:user:1', 'problem:1', 'problem:2', 'problem:3');

    // Check if member exists
    const hasSolved = await redisHelpers.sismember('solved:user:1', 'problem:1');
    console.log('Has solved problem 1:', hasSolved);

    // Get all members
    const solvedProblems = await redisHelpers.smembers('solved:user:1');
    console.log('Solved problems:', solvedProblems);
}

// Example 7: Caching API responses
export async function cacheExample(problemId) {
    const cacheKey = `problem:${problemId}`;

    // Try to get from cache first
    let problem = await redisHelpers.get(cacheKey);

    if (problem) {
        console.log('Cache hit!');
        return problem;
    }

    // If not in cache, fetch from database
    console.log('Cache miss, fetching from database...');
    problem = await fetchProblemFromDatabase(problemId);

    // Store in cache for 5 minutes
    await redisHelpers.set(cacheKey, problem, 300);

    return problem;
}

// Example 8: Rate limiting
export async function rateLimitExample(userId) {
    const key = `ratelimit:${userId}`;
    const limit = 10; // 10 requests
    const window = 60; // per 60 seconds

    const current = await redisHelpers.incr(key);

    if (current === 1) {
        // First request, set expiration
        await redisHelpers.expire(key, window);
    }

    if (current > limit) {
        throw new Error('Rate limit exceeded');
    }

    return { remaining: limit - current };
}

// Example 9: Using raw Redis client for advanced operations
export async function advancedExample() {
    // You can use the raw redis client for operations not covered by helpers
    const result = await redis.ping();
    console.log('Ping result:', result);

    // Pipeline for batch operations
    const pipeline = redis.pipeline();
    pipeline.set('key1', 'value1');
    pipeline.set('key2', 'value2');
    pipeline.get('key1');
    const results = await pipeline.exec();
    console.log('Pipeline results:', results);

    // Transaction
    const multi = redis.multi();
    multi.set('balance:user1', 100);
    multi.decrby('balance:user1', 10);
    const transactionResults = await multi.exec();
    console.log('Transaction results:', transactionResults);
}

// Mock function for example
async function fetchProblemFromDatabase(problemId) {
    return {
        id: problemId,
        title: 'Two Sum',
        difficulty: 'Easy',
    };
}

// Example usage in an API route:
//
// import { redisHelpers } from '@/lib/redis';
//
// export async function GET(request) {
//   const cacheKey = 'problems:all';
//
//   // Try cache first
//   let problems = await redisHelpers.get(cacheKey);
//
//   if (!problems) {
//     // Fetch from database
//     problems = await prisma.problem.findMany();
//
//     // Cache for 5 minutes
//     await redisHelpers.set(cacheKey, problems, 300);
//   }
//
//   return Response.json(problems);
// }
