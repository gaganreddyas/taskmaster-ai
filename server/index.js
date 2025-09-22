// server/index.js

const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

// THIS MUST BE AT THE VERY TOP TO LOAD ENVIRONMENT VARIABLES
dotenv.config();

// NOW YOU CAN IMPORT OTHER FILES
const mongoose = require('mongoose');
const taskRoutes = require('./routes/taskRoutes');

// Initialize the Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // To parse JSON bodies

// Define the port the server will run on
const PORT = process.env.PORT || 5001;

// Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Successfully connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// API Routes
app.use('/api/tasks', taskRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});