const express = require('express');
const Comment = require('../models/Comment');
const Task = require('../models/Task');

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { taskId, text } = req.body;
    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    if (!task.createdBy.equals(req.user._id) && !task.assignee?.equals(req.user._id)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const comment = new Comment({ text, author: req.user._id, task: taskId });
    await comment.save();
    task.comments.push(comment._id);
    await task.save();

    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/task/:taskId', async (req, res) => {
  try {
    const task = await Task.findById(req.params.taskId);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    if (!task.createdBy.equals(req.user._id) && !task.assignee?.equals(req.user._id)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const comments = await Comment.find({ task: req.params.taskId }).populate('author', 'name email');
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
