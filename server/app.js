const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const cookieParser = require('cookie-parser');

const restaurantRouter = require('./routes/restaurantRoutes');

const app = express();

// app.enable('trust proxy')

// --------- 1) GLOBAL MIDDLEWARES -----------
app.use(cors());
// app.use(cors(), {
//   origin: 'https://www.xxx.com',
// });

app.options('*', cors());
// need express.static?
// need to define view if using React?
// helmet
app.use(express.static(path.join(__dirname, 'dev-data/img')));

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Limit #requests from a single IP address
const limiter = rateLimit({
  // max: 100, //TODO revert back to this
  max: 10000,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour',
});
app.use('/api', limiter);

// Body parser, reading data from the body into req.body
app.use(express.json({ limit: '10kb' })); // limit the body content to 10kb
app.use(express.urlencoded({ extended: true, limit: '10kb' })); // parsing data from a form and makes it available on the req.body object

app.use(cookieParser()); // parse cookies attached to the client request object and makes the cookies accessible via req.cookies

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// ------------------ 2) API ROUTES ------------------
app.use('/api/v1/restaurants', restaurantRouter);

// app.use('/', viewRouter);

module.exports = app;
