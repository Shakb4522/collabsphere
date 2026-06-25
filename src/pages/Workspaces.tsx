import { useState, useEffect } from 'react';
import { Search, Plus, Users, FolderOpen, LogIn, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const gradientColors = [
  'from-blue-500 to-indigo-500',
  'from-purple-500 to-pink-500',
  'from-green-500 to-emerald-500',
  'from-orange-500 to-red-500',
  'from-cyan-500 to-blue-500'
];

const Workspaces = () => {
  const navigate = useNavigate();
  const [workspaces, setWorkspaces] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newWorkspaceName, setNewWorkspaceName] = useState('');
  const [newWorkspaceColor, setNewWorkspaceColor] = useState(gradientColors[0]);

  // Get user from localStorage
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  const userId = user?._id;

  useEffect(() => {
    if (!userId) {
      navigate('/login');
      return;
    }

    fetch(`${API_URL}/api/workspaces?userId=${userId}`)
      .then(res => res.json())
      .then(data => {
        setWorkspaces(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [userId, navigate]);

  const handleCreateWorkspace = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWorkspaceName || !userId) return;
    try {
      const response = await fetch(`${API_URL}/api/workspaces`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newWorkspaceName, color: newWorkspaceColor, userId })
      });
      if (response.ok) {
        const newWorkspace = await response.json();
        setWorkspaces([...workspaces, newWorkspace]);
        setShowCreateModal(false);
        setNewWorkspaceName('');
        setNewWorkspaceColor(gradientColors[0]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const joinWorkspace = async () => {
    const inviteCode = prompt('Enter workspace referral code:');
    if (!inviteCode || !userId) return;
    try {
      const response = await fetch(`${API_URL}/api/workspaces/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inviteCode, userId })
      });
      if (response.ok) {
        const joinedWorkspace = await response.json();
        if (!workspaces.find(ws => ws._id === joinedWorkspace._id)) {
          setWorkspaces([...workspaces, joinedWorkspace]);
        }
        alert(`Successfully joined ${joinedWorkspace.name}!`);
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Failed to join workspace');
      }
    } catch (error) {
      console.error(error);
      alert('Network error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-white">Workspaces</h1>
          <p className="text-textSecondary mt-1">Manage all your collaborative spaces.</p>
        </div>
        <div className="flex space-x-3">
          <button onClick={joinWorkspace} className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center space-x-2 transition-all border border-slate-700">
            <LogIn size={16} />
            <span>Join with Code</span>
          </button>
          <button onClick={() => setShowCreateModal(true)} className="bg-primary hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center space-x-2 transition-all duration-200 shadow-lg shadow-primary/20">
            <Plus size={16} />
            <span>Create Workspace</span>
          </button>
        </div>
      </div>

      <div className="relative max-w-md w-full group">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
        <input 
          type="text" 
          placeholder="Search workspaces..." 
          className="w-full bg-secondary border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-inner"
        />
      </div>

      {loading ? (
        <div className="text-white text-center py-10 opacity-50">Loading workspaces...</div>
      ) : workspaces.length === 0 ? (
        <div className="text-center py-16 bg-secondary/50 rounded-2xl border border-slate-700/50 border-dashed">
          <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <FolderOpen className="text-slate-400" size={24} />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">No Workspaces Yet</h3>
          <p className="text-textSecondary mb-6 max-w-sm mx-auto">You are not a member of any workspaces. Create a new one or join an existing workspace using a referral code.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
          {workspaces.map((ws, i) => (
            <Link key={ws._id} to={`/workspaces/${ws._id}`}>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className="bg-secondary p-6 rounded-2xl border border-slate-700/50 hover:border-primary/50 transition-colors cursor-pointer group hover:shadow-lg h-full relative overflow-hidden"
              >
                <div className="absolute top-4 right-4 text-xs font-mono text-slate-500 bg-slate-800/50 px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                  Code: {ws.inviteCode}
                </div>
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-tr ${ws.color} flex items-center justify-center text-2xl font-bold text-white mb-4 shadow-lg group-hover:scale-105 transition-transform`}>
                  {ws.name.charAt(0).toUpperCase()}
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors">{ws.name}</h3>
                <div className="flex items-center space-x-4 mt-4 text-textSecondary text-sm">
                  <div className="flex items-center space-x-1">
                    <Users size={16} />
                    <span>{ws.members?.length || 0}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <FolderOpen size={16} />
                    <span>{ws.channels?.length || 0}</span>
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      )}

      {/* Create Workspace Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-background/80 backdrop-blur-sm"
              onClick={() => setShowCreateModal(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-secondary border border-slate-700/50 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
            >
              <div className="flex justify-between items-center p-6 border-b border-slate-700/50">
                <h2 className="text-xl font-bold text-white">Create Workspace</h2>
                <button 
                  onClick={() => setShowCreateModal(false)}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleCreateWorkspace} className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Workspace Name
                  </label>
                  <input
                    type="text"
                    required
                    autoFocus
                    placeholder="e.g. Design Team, Engineering"
                    value={newWorkspaceName}
                    onChange={(e) => setNewWorkspaceName(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-3">
                    Workspace Theme Color
                  </label>
                  <div className="flex space-x-3">
                    {gradientColors.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setNewWorkspaceColor(color)}
                        className={`w-10 h-10 rounded-full bg-gradient-to-tr ${color} flex items-center justify-center transition-transform ${newWorkspaceColor === color ? 'ring-2 ring-white scale-110' : 'hover:scale-105'}`}
                      />
                    ))}
                  </div>
                </div>
                <div className="pt-4 flex space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-primary hover:bg-blue-600 text-white rounded-lg font-medium shadow-lg shadow-primary/20 transition-colors"
                  >
                    Create
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
export default Workspaces;
