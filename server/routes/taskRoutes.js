const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize Google AI - This assumes your .env file is loaded correctly in index.js
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest"});

// ROUTE 1: GET all tasks
// @desc    Fetches all tasks from the database
router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find({}).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    console.error("Error fetching tasks:", err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// ROUTE 2: POST a new task (AI VERSION)
// @desc    Creates a new task and uses AI to set its priority
router.post('/', async (req, res) => {
  try {
    const { title } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    // --- AI INTEGRATION ---
    const prompt = `Based on the following task, classify its priority as "High", "Medium", or "Low". Consider words like "urgent", "asap", "important", "now" for High priority. Respond with only one word. Task: "${title}"`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let priority = response.text().trim();

    // Fallback in case the AI response is not one of the expected values
    if (!['High', 'Medium', 'Low'].includes(priority)) {
      priority = 'Medium';
    }
    // --------------------

    const newTask = new Task({
      title,
      priority, // Use the priority from the AI
    });
    
    const savedTask = await newTask.save();
    res.status(201).json(savedTask);

  } catch (err) {
    console.error("Error in POST route:", err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// ROUTE 3: PUT (Update) a task
// @desc    Updates a task, e.g., to mark it as complete
router.put('/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Toggle the completion status
    task.isCompleted = !task.isCompleted;

    const updatedTask = await task.save();
    res.json(updatedTask);
  } catch (err) {
    console.error("Error updating task:", err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// ROUTE 4: DELETE a task
// @desc    Deletes a task by its ID
router.delete('/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    await task.deleteOne();
    res.json({ message: 'Task removed' });
  } catch (err) {
    console.error("Error deleting task:", err);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;