import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, FolderOpen, Activity, Plus, Hash, Video, Settings, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const WorkspaceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [workspace, setWorkspace] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [showChannelModal, setShowChannelModal] = useState(false);
  const [newChannelName, setNewChannelName] = useState('');
  
  const [showMeetingModal, setShowMeetingModal] = useState(false);
  const [newMeetingName, setNewMeetingName] = useState('');
  const [isLive, setIsLive] = useState(false);
  const [scheduledFor, setScheduledFor] = useState('');

  useEffect(() => {
    fetchWorkspace();
  }, [id]);

  const fetchWorkspace = () => {
    fetch(`http://localhost:5000/api/workspaces/${id}`)
      .then(res => res.json())
      .then(data => {
        setWorkspace(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  const handleCreateChannel = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChannelName) return;
    try {
      const res = await fetch(`http://localhost:5000/api/workspaces/${id}/channels`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newChannelName })
      });
      if (res.ok) {
        const updated = await res.json();
        setWorkspace({ ...workspace, channels: updated.channels });
        setShowChannelModal(false);
        setNewChannelName('');
      }
    } catch (err) { console.error(err); }
  };

  const handleCreateMeeting = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMeetingName) return;
    try {
      const res = await fetch(`http://localhost:5000/api/workspaces/${id}/meetings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newMeetingName, isLive, scheduledFor: isLive ? null : scheduledFor })
      });
      if (res.ok) {
        const updated = await res.json();
        setWorkspace({ ...workspace, meetings: updated.meetings });
        setShowMeetingModal(false);
        setNewMeetingName('');
        setIsLive(false);
        setScheduledFor('');
      }
    } catch (err) { console.error(err); }
  };

  if (loading) return <div className="text-white text-center py-10 opacity-50">Loading workspace...</div>;
  if (!workspace) return <div className="text-white text-center py-10 opacity-50">Workspace not found</div>;

  return (
    <div className="space-y-6 relative pb-10">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/workspaces" className="p-2 bg-secondary rounded-lg text-slate-400 hover:text-white transition-colors border border-slate-700/50">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center">
              {workspace.name}
              <span className="ml-3 px-2 py-0.5 rounded text-xs font-medium bg-primary/20 text-primary border border-primary/30">
                Code: {workspace.inviteCode}
              </span>
            </h1>
            <p className="text-textSecondary mt-1">Manage members, channels, and meetings.</p>
          </div>
        </div>
        <button className="bg-slate-800 hover:bg-slate-700 text-slate-300 p-2 rounded-lg transition-colors border border-slate-700">
          <Settings size={20} />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT COLUMN: Channels and Meetings */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* CHANNELS PANEL */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-secondary p-6 rounded-2xl border border-slate-700/50 shadow-sm flex flex-col h-[400px]">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-white flex items-center">
                  <FolderOpen className="mr-2 text-primary" size={20} />
                  Channels
                </h3>
                <button onClick={() => setShowChannelModal(true)} className="text-slate-400 hover:text-white transition-colors p-1 bg-slate-800 rounded-md border border-slate-700 hover:border-slate-500">
                  <Plus size={16} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                {workspace.channels?.map((c: any) => (
                  <div key={c._id} onClick={() => navigate(`/chat/${id}/${c._id}`)} className="flex items-center justify-between p-3 rounded-xl bg-slate-800/30 hover:bg-slate-800 transition-colors cursor-pointer group border border-transparent hover:border-slate-700/50">
                    <div className="flex items-center text-slate-300 group-hover:text-white transition-colors">
                      <Hash size={16} className="mr-3 text-slate-500 group-hover:text-primary transition-colors" />
                      <span className="font-medium">{c.name}</span>
                    </div>
                    {c.unread > 0 && (
                      <span className="bg-primary text-white px-2 py-0.5 rounded-full text-xs font-bold shadow-lg shadow-primary/20">{c.unread}</span>
                    )}
                  </div>
                ))}
                {(!workspace.channels || workspace.channels.length === 0) && (
                  <p className="text-sm text-textSecondary text-center py-4">No channels yet.</p>
                )}
              </div>
            </motion.div>

            {/* MEETINGS PANEL */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-secondary p-6 rounded-2xl border border-slate-700/50 shadow-sm flex flex-col h-[400px]">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-white flex items-center">
                  <Video className="mr-2 text-blue-400" size={20} />
                  Meetings
                </h3>
                <button onClick={() => setShowMeetingModal(true)} className="text-slate-400 hover:text-white transition-colors p-1 bg-slate-800 rounded-md border border-slate-700 hover:border-slate-500">
                  <Plus size={16} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                {workspace.meetings?.map((m: any) => (
                  <div key={m._id} className="flex flex-col p-3 rounded-xl bg-slate-800/30 border border-slate-700/50 hover:border-blue-500/50 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-medium text-white">{m.name}</span>
                      {m.isLive ? (
                        <span className="flex items-center text-xs font-bold text-error bg-error/10 px-2 py-0.5 rounded-md border border-error/20">
                          <span className="w-1.5 h-1.5 rounded-full bg-error mr-1.5 animate-pulse"></span>
                          LIVE
                        </span>
                      ) : (
                        <span className="text-xs font-medium text-slate-400 bg-slate-800 px-2 py-0.5 rounded-md border border-slate-700">
                          {m.scheduledFor ? new Date(m.scheduledFor).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Scheduled'}
                        </span>
                      )}
                    </div>
                    <button onClick={() => navigate(`/meeting/${id}/${m._id}`)} className={`w-full py-1.5 rounded-lg text-sm font-medium transition-colors ${m.isLive ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20' : 'bg-slate-700 hover:bg-slate-600 text-slate-300'}`}>
                      Join Room
                    </button>
                  </div>
                ))}
                {(!workspace.meetings || workspace.meetings.length === 0) && (
                  <p className="text-sm text-textSecondary text-center py-4">No meetings scheduled.</p>
                )}
              </div>
            </motion.div>
          </div>
          
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-secondary p-6 rounded-2xl border border-slate-700/50 shadow-sm">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center">
              <Activity className="mr-2 text-primary" size={20} />
              Recent Activity
            </h3>
            <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-700 before:to-transparent">
              <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-800 text-slate-500 group-[.is-active]:text-emerald-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 relative">
                  <Users size={16} />
                </div>
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-slate-700/50 bg-slate-800/50 shadow">
                  <div className="flex items-center justify-between space-x-2 mb-1">
                    <div className="font-bold text-slate-200 text-sm">Workspace Created</div>
                    <time className="font-sans text-xs font-medium text-slate-500">Just now</time>
                  </div>
                  <div className="text-slate-400 text-sm">Welcome to {workspace.name}!</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* RIGHT COLUMN: Members and Stats */}
        <div className="space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-secondary p-6 rounded-2xl border border-slate-700/50 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-white flex items-center">
                <Users className="mr-2 text-primary" size={20} />
                Members ({workspace.members?.length || 0})
              </h3>
            </div>
            <div className="space-y-3">
              {workspace.members?.map((m: any) => (
                <div key={m._id} className="flex items-center space-x-3 p-2 rounded-xl hover:bg-slate-800/50 transition-colors border border-transparent hover:border-slate-700/50">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold shadow-md">
                    {m.name ? m.name.substring(0,2).toUpperCase() : 'U'}
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm">{m.name || m.email}</p>
                    <p className="text-xs text-textSecondary">{m.role || 'Member'}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-secondary p-6 rounded-2xl border border-slate-700/50 shadow-sm">
            <h3 className="text-lg font-bold text-white mb-4">Quick Stats</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50 text-center">
                <p className="text-xs text-textSecondary mb-1">Channels</p>
                <p className="text-xl font-bold text-white">{workspace.channels?.length || 0}</p>
              </div>
              <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50 text-center">
                <p className="text-xs text-textSecondary mb-1">Meetings</p>
                <p className="text-xl font-bold text-white">{workspace.meetings?.length || 0}</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* CREATE CHANNEL MODAL */}
      <AnimatePresence>
        {showChannelModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setShowChannelModal(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative bg-secondary border border-slate-700/50 rounded-2xl shadow-2xl w-full max-w-md p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white">Create Channel</h2>
                <button onClick={() => setShowChannelModal(false)} className="text-slate-400 hover:text-white transition-colors"><X size={20} /></button>
              </div>
              <form onSubmit={handleCreateChannel} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Channel Name</label>
                  <div className="relative">
                    <Hash className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                    <input autoFocus required type="text" value={newChannelName} onChange={(e) => setNewChannelName(e.target.value.toLowerCase().replace(/\s+/g, '-'))} placeholder="e.g. general, design-updates" className="w-full pl-9 pr-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" />
                  </div>
                </div>
                <div className="pt-2 flex space-x-3">
                  <button type="button" onClick={() => setShowChannelModal(false)} className="flex-1 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-medium transition-colors">Cancel</button>
                  <button type="submit" className="flex-1 px-4 py-2 bg-primary hover:bg-blue-600 text-white rounded-lg font-medium shadow-lg shadow-primary/20 transition-colors">Create</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CREATE MEETING MODAL */}
      <AnimatePresence>
        {showMeetingModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setShowMeetingModal(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative bg-secondary border border-slate-700/50 rounded-2xl shadow-2xl w-full max-w-md p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white">Schedule Meeting</h2>
                <button onClick={() => setShowMeetingModal(false)} className="text-slate-400 hover:text-white transition-colors"><X size={20} /></button>
              </div>
              <form onSubmit={handleCreateMeeting} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Meeting Subject</label>
                  <input autoFocus required type="text" value={newMeetingName} onChange={(e) => setNewMeetingName(e.target.value)} placeholder="e.g. Weekly Standup, Design Review" className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all" />
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg border border-slate-700">
                  <div>
                    <p className="text-sm font-medium text-white">Start immediately</p>
                    <p className="text-xs text-textSecondary">Meeting will be marked as LIVE</p>
                  </div>
                  <div onClick={() => setIsLive(!isLive)} className={`w-11 h-6 rounded-full relative cursor-pointer transition-colors ${isLive ? 'bg-error' : 'bg-slate-600'}`}>
                    <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${isLive ? 'right-1' : 'left-1'}`}></div>
                  </div>
                </div>
                <div className={`transition-all overflow-hidden ${isLive ? 'h-0 opacity-0' : 'h-20 opacity-100 mt-4'}`}>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Schedule Time</label>
                  <input 
                    type="datetime-local" 
                    value={scheduledFor}
                    onChange={(e) => setScheduledFor(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                    required={!isLive}
                  />
                </div>
                <div className="pt-2 flex space-x-3">
                  <button type="button" onClick={() => setShowMeetingModal(false)} className="flex-1 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-medium transition-colors">Cancel</button>
                  <button type="submit" className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium shadow-lg shadow-blue-600/20 transition-colors">Create</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
export default WorkspaceDetails;
