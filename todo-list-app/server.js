const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Update the MongoDB connection string to use the 'Codxo' database
mongoose.connect(process.env.MONGODB_URI + '/Codxo', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB (Codxo database)'))
.catch(err => {
  console.error('Error connecting to MongoDB:', err);
  console.error('MongoDB URI:', process.env.MONGODB_URI + '/Codxo');
});

app.use('/api/tasks', require('./routes/tasks'));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});