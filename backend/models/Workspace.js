const mongoose = require('mongoose');

const workspaceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  color: { type: String, default: 'from-blue-500 to-indigo-500' },
  inviteCode: { 
    type: String, 
    unique: true, 
    default: () => Math.random().toString(36).substring(2, 8).toUpperCase() 
  },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  channels: [{ name: String, unread: { type: Number, default: 0 } }],
  meetings: [{ name: String, isLive: { type: Boolean, default: false }, scheduledFor: { type: Date } }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Workspace', workspaceSchema);
