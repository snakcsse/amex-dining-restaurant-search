// require('dotenv').config({ path: '../config.env' }); // Load environment variables
// const redis = require('redis');

// let client = null;

// if (process.env.NODE_ENV === 'production') {
//   const redisUrl = process.env.REDIS_URL;
//   console.log(redisUrl);

//   if (!redisUrl) {
//     console.error('REDIS_URL environment variable is not set.');
//     process.exit(1); // Exit if Redis URL is not set
//   }

//   client = redis.createClient({
//     url: redisUrl,
//   });

//   client.on('error', (err) => {
//     console.error('Redis error:', err);
//   });

//   (async () => {
//     try {
//       await client.connect(); // Connect to Redis
//       console.log('Connected to Redis');
//     } catch (err) {
//       console.error('Failed to connect to Redis:', err);
//       // Optionally, you can exit the process to avoid continuous error logging
//       process.exit(1);
//     }
//   })();
// }

// module.exports = client;
