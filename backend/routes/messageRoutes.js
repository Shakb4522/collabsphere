const express = require('express');
const Message = require('../models/Message');
const router = express.Router();

router.get('/:channelId', async (req, res) => {
  try {
    const messages = await Message.find({ channelId: req.params.channelId }).populate('user', 'name avatar');
    res.json(messages);
  } catch (err) { res.status(500).json({ message: 'Error' }); }
});

router.post('/:channelId', async (req, res) => {
  try {
    const { workspaceId, userId, content } = req.body;
    const msg = await Message.create({ channelId: req.params.channelId, workspaceId, user: userId, content });
    const populated = await Message.findById(msg._id).populate('user', 'name avatar');
    res.json(populated);
  } catch (err) { res.status(500).json({ message: 'Error' }); }
});

module.exports = router;
