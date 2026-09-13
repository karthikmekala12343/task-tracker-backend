const express = require('express');
const Team = require('../models/Team');
const User = require('../models/User');

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { name, description, memberIds = [] } = req.body;
    const team = new Team({ name, description, owner: req.user._id, members: [req.user._id, ...memberIds] });
    await team.save();
    res.status(201).json(team);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const teams = await Team.find({ members: req.user._id }).populate('owner', 'name email').populate('members', 'name email');
    res.json(teams);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const team = await Team.findById(req.params.id).populate('owner', 'name email').populate('members', 'name email');
    if (!team) return res.status(404).json({ message: 'Team not found' });
    if (!team.members.some(member => member._id.equals(req.user._id))) {
      return res.status(403).json({ message: 'Access denied' });
    }
    res.json(team);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { name, description, memberIds } = req.body;
    const team = await Team.findById(req.params.id);
    if (!team) return res.status(404).json({ message: 'Team not found' });
    if (!team.owner.equals(req.user._id)) {
      return res.status(403).json({ message: 'Only the team owner can update the team.' });
    }

    if (name) team.name = name;
    if (description) team.description = description;
    if (memberIds) team.members = [team.owner, ...memberIds];

    await team.save();
    res.json(team);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);
    if (!team) return res.status(404).json({ message: 'Team not found' });
    if (!team.owner.equals(req.user._id)) {
      return res.status(403).json({ message: 'Only the team owner can delete the team.' });
    }
    await team.deleteOne();
    res.json({ message: 'Team deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
