const express = require('express');
const Workspace = require('../models/Workspace');
const router = express.Router();

// Get user's workspaces
router.get('/', async (req, res) => {
  try {
    const userId = req.query.userId;
    if (!userId) return res.status(400).json({ message: 'User ID required' });
    
    // Only fetch workspaces where this user is a member
    const workspaces = await Workspace.find({ members: userId }).populate('members', 'name email');
    res.json(workspaces);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get a single workspace
router.get('/:id', async (req, res) => {
  try {
    const workspace = await Workspace.findById(req.params.id).populate('members');
    if (!workspace) return res.status(404).json({ message: 'Workspace not found' });
    res.json(workspace);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new workspace
router.post('/', async (req, res) => {
  try {
    const { name, color, userId } = req.body;
    if (!userId) return res.status(400).json({ message: 'User ID required' });

    const newWorkspace = await Workspace.create({
      name,
      color: color || 'from-blue-500 to-indigo-500',
      channels: [{ name: 'general', unread: 0 }],
      members: [userId] // Creator is automatically a member
    });
    res.status(201).json(newWorkspace);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Join workspace with referral code
router.post('/join', async (req, res) => {
  try {
    const { inviteCode, userId } = req.body;
    if (!userId || !inviteCode) return res.status(400).json({ message: 'User ID and invite code required' });
    
    const workspace = await Workspace.findOne({ inviteCode: inviteCode.toUpperCase() });
    if (!workspace) return res.status(404).json({ message: 'Invalid referral code' });
    
    if (!workspace.members.includes(userId)) {
      workspace.members.push(userId);
      await workspace.save();
    }
    
    res.json(workspace);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add a channel to a workspace
router.post('/:id/channels', async (req, res) => {
  try {
    const workspace = await Workspace.findById(req.params.id);
    if (!workspace) return res.status(404).json({ message: 'Workspace not found' });
    workspace.channels.push({ name: req.body.name, unread: 0 });
    await workspace.save();
    res.json(workspace);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add a meeting to a workspace
router.post('/:id/meetings', async (req, res) => {
  try {
    const workspace = await Workspace.findById(req.params.id);
    if (!workspace) return res.status(404).json({ message: 'Workspace not found' });
    workspace.meetings.push({ 
      name: req.body.name, 
      isLive: req.body.isLive || false,
      scheduledFor: req.body.scheduledFor || null
    });
    await workspace.save();
    res.json(workspace);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
