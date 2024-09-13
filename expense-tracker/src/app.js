const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const expensesRouter = require('./routes/expenses');
const { connectDB } = require('./config/database');

const app = express();
const PORT = process.env.PORT || 3003;

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// Routes
app.use('/api/expenses', expensesRouter);

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});