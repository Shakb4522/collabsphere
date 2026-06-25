require('dotenv').config();
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String },
  createdAt: { type: Date, default: Date.now }
});

const workspaceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
});

const User = mongoose.model('User', userSchema);
const Workspace = mongoose.model('Workspace', workspaceSchema);

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);
  
  // Create 3 real test users
  const usersToCreate = [
    { email: 'alex.dev@collabsphere.com', password: 'password', name: 'Alex Developer' },
    { email: 'jessica.design@collabsphere.com', password: 'password', name: 'Jessica Designer' },
    { email: 'michael.pm@collabsphere.com', password: 'password', name: 'Michael Product' }
  ];

  for (let u of usersToCreate) {
    let existing = await User.findOne({ email: u.email });
    if (!existing) {
      existing = await User.create(u);
      console.log('Created user:', existing.name);
    }
    
    // Add to all workspaces for testing
    const workspaces = await Workspace.find();
    for (let w of workspaces) {
      if (!w.members.includes(existing._id)) {
        w.members.push(existing._id);
        await w.save();
        console.log(`Added ${existing.name} to ${w.name}`);
      }
    }
  }

  console.log('Test users successfully seeded!');
  process.exit(0);
}

run();
