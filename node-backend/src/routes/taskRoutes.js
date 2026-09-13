const express = require('express');
const Task = require('../models/Task');
const Team = require('../models/Team');

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { title, description, dueDate, assigneeId, teamId } = req.body;
    const task = new Task({
      title,
      description,
      dueDate,
      createdBy: req.user._id,
      assignee: assigneeId,
      team: teamId
    });

    if (teamId) {
      const team = await Team.findById(teamId);
      if (!team) {
        return res.status(404).json({ message: 'Team not found' });
      }
      if (!team.members.includes(req.user._id)) {
        return res.status(403).json({ message: 'Must belong to the team to create a task.' });
      }
    }

    await task.save();
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const { status, search, sortBy, assignedToMe, teamId } = req.query;
    const accessFilter = { $or: [{ createdBy: req.user._id }, { assignee: req.user._id }] };
    const filter = { ...accessFilter };

    if (status) filter.status = status;
    if (teamId) filter.team = teamId;
    if (assignedToMe === 'true') {
      filter.assignee = req.user._id;
    }
    if (search) {
      filter.$and = [
        accessFilter,
        {
          $or: [
            { title: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } }
          ]
        }
      ];
      delete filter.createdBy;
      delete filter.assignee;
    }

    const tasks = await Task.find(filter)
      .populate('createdBy', 'name email')
      .populate('assignee', 'name email')
      .populate('team', 'name');

    if (sortBy === 'dueDate') {
      tasks.sort((a, b) => new Date(a.dueDate || 0) - new Date(b.dueDate || 0));
    } else if (sortBy === 'createdAt') {
      tasks.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    }

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('assignee', 'name email')
      .populate('team', 'name')
      .populate({ path: 'comments', populate: { path: 'author', select: 'name email' } })
      .populate('attachments');

    if (!task) return res.status(404).json({ message: 'Task not found' });
    if (!task.createdBy._id.equals(req.user._id) && !task.assignee?._id.equals(req.user._id)) {
      return res.status(403).json({ message: 'Access denied' });
    }
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { title, description, dueDate, status, assigneeId, teamId } = req.body;
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    if (!task.createdBy.equals(req.user._id) && !task.assignee?.equals(req.user._id)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (title) task.title = title;
    if (description) task.description = description;
    if (dueDate) task.dueDate = dueDate;
    if (status) task.status = status;
    if (assigneeId) task.assignee = assigneeId;
    if (teamId) task.team = teamId;

    await task.save();
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    if (!task.createdBy.equals(req.user._id) && !task.assignee?.equals(req.user._id)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    await task.deleteOne();
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
