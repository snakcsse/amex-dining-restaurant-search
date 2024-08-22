const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const restaurantRouter = require('./routes/restaurantRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

// app.enable('trust proxy');
app.set('trust proxy', 3);

// --------- 1) GLOBAL MIDDLEWARES -----------
const corsOptions = {
  origin: [
    process.env.PROD_FRONTEND_URL,
    'https://amex-dining-restaurant-finder.netlify.app',
    'http://localhost:5173',
    'http://localhost:61473',
  ],
  credentials: true, // accept crendentials in CORS requests
};
app.use(cors(corsOptions));
// app.use(cors(), {
//   origin: 'https://www.xxx.com',
// });

app.options('*', cors());
app.use(express.static(path.join(__dirname, 'dev-data/img')));

app.use(helmet());

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Limit #requests from a single IP address
const limiter = rateLimit({
  max: 100, //adjust max if needed
  // max: 10000,
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

app.use(hpp());
app.use(compression());

// ------------------ 2) API ROUTES ------------------
app.use('/api/v1/restaurants', restaurantRouter);
app.use('/api/v1/users', userRouter);
// app.use('/', viewRouter);

//implementing a route handler for a route that was not catched by any of our other route handlers
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
