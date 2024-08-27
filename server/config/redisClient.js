require('dotenv').config({ path: '../config.env' }); // Load environment variables
const redis = require('redis');

// Create a Redis client
if (process.env.NODE_ENV === 'production') {
  const client = redis.createClient({
    url: process.env.REDIS_URL, // internal Redis URL
  });

  client.on('error', (err) => {
    console.error('Redis error:', err);
  });

  (async () => {
    await client.connect(); // Connect to Redis
  })();
}

const client = null;

module.exports = client;
