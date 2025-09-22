const mongoose = require('mongoose');

// This is the blueprint for our tasks
const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true, // A title is mandatory
      trim: true,     // Removes whitespace from the beginning and end
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High'], // The value must be one of these
      default: 'Medium', // Default value if none is provided
    },
    isCompleted: {
      type: Boolean,
      default: false, // Tasks are not completed by default
    },
    // We can add more fields later, like 'dueDate' or 'description'
  },
  {
    timestamps: true, // Automatically adds `createdAt` and `updatedAt` fields
  }
);

// Create the model from the schema, which is what we use to interact with the 'tasks' collection in the DB
const Task = mongoose.model('Task', taskSchema);

module.exports = Task;