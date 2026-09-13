const express = require('express');
const multer = require('multer');
const path = require('path');
const Attachment = require('../models/Attachment');
const Task = require('../models/Task');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/', upload.single('file'), async (req, res) => {
  try {
    const { taskId } = req.body;
    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    if (!task.createdBy.equals(req.user._id) && !task.assignee?.equals(req.user._id)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const attachment = new Attachment({
      filename: req.file.originalname,
      path: req.file.path,
      uploadedBy: req.user._id,
      task: taskId
    });

    await attachment.save();
    task.attachments.push(attachment._id);
    await task.save();

    res.status(201).json(attachment);
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

    const attachments = await Attachment.find({ task: req.params.taskId }).populate('uploadedBy', 'name email');
    res.json(attachments);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
