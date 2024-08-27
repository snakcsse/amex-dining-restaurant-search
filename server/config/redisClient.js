require('dotenv').config({ path: '../config.env' }); // Load environment variables
const redis = require('redis');

let client = null;
// Create a Redis client
if (process.env.NODE_ENV === 'production') {
  client = redis.createClient({
    url: process.env.REDIS_URL, // internal Redis URL
  });

  client.on('error', (err) => {
    console.error('Redis error:', err);
  });

  (async () => {
    try {
      await client.connect(); // Connect to Redis
      console.log('Connected to Redis');
    } catch (err) {
      console.error('Failed to connect to Redis:', err);
    }
  })();
}

module.exports = client;
