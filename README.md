# Amex dining restaurant finder

Amex dining restaurant finder is a full-stack application that helps users find restaurants that offer 50% discounts for 2 people if they are amex gold or golden preferred credit card holders in Japan.

The restaurants are displayed with their google rating and rating count, which are fetched from Google Places API, and can be viewed in both list and map view. The restaurants can be filtered and sorted, and users can save their favourite restaurants by creating an account. Optimized for desktop and mobile.

### Live Demo

Check out the live version of the app [here](https://amex-dining-restaurant-finder.netlify.app/)

## Installation

To set up the project locally, follow these steps:

1. **Clone the repo**

   ```bash
   git clone https://github.com/snakcsse/amex-dining-restaurant-search
   ```

2. **Create environment variables**

   - Create a 'config.env' file in the Server directory and '.env.development' file in the client directory with the following variables:

   #### Server: `config.env` File

   ```env
    DATABASE=your-mongodb-url
    DATABASE_PASSWORD=your-mongodb-password

    GOOGLE_PLACES_API_KEY_DEV=your-google-place-api-key

    JWT_SECRET=your-jwt-secret
    JWT_EXPIRES_IN=90d
    JWT_COOKIE_EXPIRES_IN=90

    EMAIL_FROM=your-email
    BREVO_API_KEY=your-brevo-smtp-api-key
    SENDINBLUE_HOST=your-brevo-smtp-host
    SENDINBLUE_PORT=your-brevo-smtp-port
    SENDINBLUE_LOGIN=your-brevo-smtp-login
    SENDINBLUE_PASSWORD=your-brevo-smtp-password

    EMAIL_USERNAME=your-sandbox-username
    EMAIL_PASSWORD=your-sandbox-password
    EMAIL_HOST=your-sandbox-username-smtp-host
    EMAIL_PORT=your-sandbox-port

    DEV_FRONTEND_URL=http://localhost:5173
   ```

   #### Client: `.env.environment` File

   ```env
   VITE_BACKEND_HOST_URL=http://localhost:3000
   ```

3. **Set up the backend**

   - Navigate to 'server' folder and install dependencies:

   ```
    cd backend
    npm install
   ```

4. **Set up the frontend**

   - Navigate to 'client' folder and install dependencies:

   ```
   cd ../client
   npm install
   ```

5. **Import restaurant data into MongoDB**

   ```
   cd ../server/dev-data/data
   node impot-dev-data.js --import
   ```

6. **Run the application**

   - Start the backend server:

   ```
   cd ../../
   npm run dev
   ```

   - In a new terminal, start the frontend development server

   ```
   cd ../client
   npm run dev
   ```

## Folder structure

- 'client/': Contains the Vite-based React frontend application
- 'server/': Contains the Node.js/Express backend, including API routes and MongoDB connection.
- 'scraper/': Used for initial data scraping of restaurant information. The data is saved in the server/dev-data/data/final_restaurants.json.

## Technology Stack

- React
- Context API
- Node.js
- Express
- MongoDB/Mongoose
- Python
- AWS Lambda
- Redis

## Author

Seita Nakagawa

## License

This project is licensed under the MIT License - see the LICENSE file for details.
