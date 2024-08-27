const dotenv = require('dotenv');
const redis = require('redis');

dotenv.config({ path: './config.env' }); // Load environment variables

let client = null;
const redisUrl = process.env.REDIS_URL;

if (process.env.NODE_ENV === 'production') {
  if (!redisUrl) {
    console.error('REDIS_URL environment variable is not set.');
    process.exit(1); // Exit if Redis URL is not set
  }

  client = redis.createClient({
    url: redisUrl,
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
      // Optionally, you can exit the process to avoid continuous error logging
      process.exit(1);
    }
  })();
}

module.exports = client;
