// Init
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const app = express();

// Load .env variables
dotenv.config({
  path: './config/config.env'
});

// Route files
const bootcamps = require('./routes/bootcamps');

// Mount middlewares
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Mount routers
app.use('/api/v1/bootcamps', bootcamps);

// Start server
const PORT = process.env.PORT || 5000;

app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);
