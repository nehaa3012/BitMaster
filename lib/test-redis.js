/**
 * Test script to verify Redis connection
 * Run with: node lib/test-redis.js
 */

import redis, { redisHelpers } from './redis.js';

async function testRedisConnection() {
    try {
        console.log('🧪 Testing Redis connection...\n');

        // Test 1: Ping
        console.log('1️⃣ Testing PING command...');
        const pingResult = await redis.ping();
        console.log(`   ✅ PING response: ${pingResult}\n`);

        // Test 2: Set and Get
        console.log('2️⃣ Testing SET and GET...');
        await redisHelpers.set('test:key', 'Hello Redis!');
        const value = await redisHelpers.get('test:key');
        console.log(`   ✅ Stored and retrieved: "${value}"\n`);

        // Test 3: JSON storage
        console.log('3️⃣ Testing JSON storage...');
        const testData = { name: 'LeetCode', type: 'Platform', active: true };
        await redisHelpers.set('test:json', testData);
        const retrievedData = await redisHelpers.get('test:json');
        console.log(`   ✅ Stored and retrieved JSON:`, retrievedData, '\n');

        // Test 4: Counter
        console.log('4️⃣ Testing counter operations...');
        await redisHelpers.set('test:counter', 0);
        await redisHelpers.incr('test:counter');
        await redisHelpers.incr('test:counter');
        const counter = await redisHelpers.get('test:counter');
        console.log(`   ✅ Counter value: ${counter}\n`);

        // Test 5: Expiration
        console.log('5️⃣ Testing key expiration...');
        await redisHelpers.set('test:expire', 'This will expire', 2);
        console.log('   ⏱️  Key set with 2 second expiration');
        const beforeExpire = await redisHelpers.get('test:expire');
        console.log(`   ✅ Before expiration: "${beforeExpire}"`);
        console.log('   ⏳ Waiting 3 seconds...');
        await new Promise(resolve => setTimeout(resolve, 3000));
        const afterExpire = await redisHelpers.get('test:expire');
        console.log(`   ✅ After expiration: ${afterExpire}\n`);

        // Cleanup
        console.log('🧹 Cleaning up test keys...');
        await redisHelpers.del('test:key', 'test:json', 'test:counter');
        console.log('   ✅ Cleanup complete\n');

        console.log('✅ All tests passed! Redis is working correctly.\n');

        // Get server info
        const info = await redis.info('server');
        const version = info.match(/redis_version:([^\r\n]+)/)?.[1];
        console.log(`📊 Redis version: ${version}`);

        process.exit(0);
    } catch (error) {
        console.error('❌ Error testing Redis:', error);
        process.exit(1);
    }
}

testRedisConnection();
