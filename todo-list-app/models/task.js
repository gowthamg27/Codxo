const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
}, { collection: 'todos' }); // Specify the collection name here

module.exports = mongoose.model('Task', TaskSchema);