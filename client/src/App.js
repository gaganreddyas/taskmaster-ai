import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setError(null);
        setLoading(true);
  const response = await axios.get('https://taskmaster-ai-8zdi.onrender.com/api/tasks');
        setTasks(response.data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
        setError("Failed to fetch tasks. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    try {
  const response = await axios.post('https://taskmaster-ai-8zdi.onrender.com/api/tasks', { title: newTaskTitle });
      setTasks([...tasks, response.data]);
      setNewTaskTitle('');
    } catch (error) {
      console.error("Error creating task:", error);
      setError("Failed to add task. Please try again.");
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`/api/tasks/${id}`);
      setTasks(tasks.filter(task => task._id !== id));
    } catch (error) {
      console.error("Error deleting task:", error);
      setError("Failed to delete task. Please try again.");
    }
  };

  const toggleComplete = async (id) => {
    try {
      const response = await axios.put(`/api/tasks/${id}`);
      setTasks(tasks.map(task => task._id === id ? response.data : task));
    } catch (error) {
      console.error("Error updating task:", error);
      setError("Failed to update task. Please try again.");
    }
  };

  const activeTasks = tasks.filter(task => !task.isCompleted);
  const completedTasks = tasks.filter(task => task.isCompleted);

  return (
    <div className="container">
      <div className="header">
        <h1 className="title">TaskMaster AI</h1>
      </div>

      <div className="form-container">
        <form onSubmit={handleSubmit} className="form">
          <input
            type="text"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            placeholder="Add a new task and let AI set the priority..."
            className="input"
          />
          <button type="submit" className="button">
            Add Task
          </button>
        </form>
      </div>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="loading-message">Loading tasks...</div>
      ) : (
        <div>
          <div className="section">
            <h2 className="section-title">Active Tasks</h2>
            {activeTasks.length > 0 ? (
              <ul className="task-list">
                {activeTasks.map(task => (
                  <li key={task._id} className="task-item">
                    <div className="task-content">
                      <input
                        type="checkbox"
                        checked={task.isCompleted}
                        onChange={() => toggleComplete(task._id)}
                        className="checkbox"
                      />
                      <span className="task-title">{task.title}</span>
                    </div>
                    <div className="task-actions">
                      <span className={`priority-badge priority-${task.priority.toLowerCase()}`}>
                        {task.priority}
                      </span>
                      <button onClick={() => deleteTask(task._id)} className="delete-button">
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="empty-message">No active tasks. Great job!</p>
            )}
          </div>

          <div className="section">
            <h2 className="section-title">Completed Tasks</h2>
            {completedTasks.length > 0 ? (
              <ul className="task-list">
                {completedTasks.map(task => (
                  <li key={task._id} className="task-item completed">
                    <div className="task-content">
                      <input
                        type="checkbox"
                        checked={task.isCompleted}
                        onChange={() => toggleComplete(task._id)}
                        className="checkbox"
                      />
                      <span className="task-title completed">{task.title}</span>
                    </div>
                    <button onClick={() => deleteTask(task._id)} className="delete-button">
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="empty-message">No tasks completed yet.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
