const express = require('express');
const dotenv = require('dotenv');
const app = express();

// Route files
const bootcamps = require('./routes/bootcamps');

// Load .env variables
dotenv.config({
  path: './config/config.env'
});

// Mount routers
app.use('/api/v1/bootcamps', bootcamps);

// Start server
const PORT = process.env.PORT || 5000;

app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);