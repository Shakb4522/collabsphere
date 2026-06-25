import { useState } from 'react';
import { Search, HelpCircle, Plus, Bell, MessageSquare, Video, File, AtSign } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    { id: 1, type: 'mention', user: 'Sarah', message: 'mentioned you in #design', time: '5m ago', icon: AtSign, color: 'text-purple-400', bg: 'bg-purple-400/10' },
    { id: 2, type: 'meeting', user: 'John', message: 'started a weekly sync', time: '15m ago', icon: Video, color: 'text-blue-400', bg: 'bg-blue-400/10' },
    { id: 3, type: 'file', user: 'Mike', message: 'shared Dashboard Design.fig', time: '1h ago', icon: File, color: 'text-green-400', bg: 'bg-green-400/10' },
    { id: 4, type: 'message', user: 'Emily', message: 'sent you a direct message', time: '2h ago', icon: MessageSquare, color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
  ];

  return (
    <header className="h-16 bg-background border-b border-slate-700/50 flex items-center justify-between px-6 z-30 relative">
      <div className="flex-1 max-w-xl">
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-slate-700 rounded-lg leading-5 bg-slate-800/50 text-slate-300 placeholder-slate-400 focus:outline-none focus:bg-secondary focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm transition-all duration-200"
            placeholder="Search workspaces, channels, or files..."
          />
          <div className="absolute inset-y-0 right-0 pr-2 flex items-center">
            <kbd className="inline-flex items-center border border-slate-600 rounded px-2 text-sm font-sans font-medium text-slate-400">
              ⌘ K
            </kbd>
          </div>
        </div>
      </div>
      <div className="flex items-center space-x-4 ml-4">
        <div className="relative">
          <button 
            className={`text-slate-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-slate-800 relative ${showNotifications ? 'bg-slate-800 text-white' : ''}`}
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <Bell size={20} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error rounded-full animate-pulse border border-background"></span>
          </button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-2 w-80 bg-secondary border border-slate-700/50 rounded-2xl shadow-xl overflow-hidden z-50"
              >
                <div className="p-4 border-b border-slate-700/50 flex justify-between items-center bg-slate-800/30">
                  <h3 className="text-white font-bold text-sm">Notifications</h3>
                  <button className="text-xs text-primary hover:text-blue-400 font-medium transition-colors">Mark all as read</button>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.map((notif) => (
                    <div key={notif.id} className="p-4 border-b border-slate-700/50 hover:bg-slate-800/50 transition-colors cursor-pointer flex space-x-3">
                      <div className={`p-2 rounded-xl ${notif.bg} ${notif.color} flex-shrink-0 h-fit`}>
                        <notif.icon size={16} />
                      </div>
                      <div>
                        <p className="text-sm text-white">
                          <span className="font-semibold">{notif.user}</span> {notif.message}
                        </p>
                        <p className="text-xs text-textSecondary mt-1">{notif.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-3 bg-slate-800/30 text-center">
                  <button className="text-sm text-textSecondary hover:text-white font-medium transition-colors">View all notifications</button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <button className="text-slate-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-slate-800">
          <HelpCircle size={20} />
        </button>
        <button className="bg-primary hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center space-x-2 transition-all duration-200 shadow-lg shadow-primary/20 transform hover:-translate-y-0.5">
          <Plus size={16} />
          <span>New Workspace</span>
        </button>
      </div>
    </header>
  );
};

export default Navbar;
