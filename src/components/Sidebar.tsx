import { NavLink, Link } from 'react-router-dom';
import { LayoutDashboard, LayoutGrid, MessageSquare, Video, PenTool, Folder, Settings, Bell } from 'lucide-react';
import { motion } from 'framer-motion';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: LayoutGrid, label: 'Workspaces', path: '/workspaces' },
  { icon: MessageSquare, label: 'Channels', path: '/chat' },
  { icon: Video, label: 'Meetings', path: '/meeting' },
  { icon: PenTool, label: 'Whiteboard', path: '/whiteboard' },
  { icon: Folder, label: 'Files', path: '/files' },
];

const Sidebar = () => {
  return (
    <div className="w-64 h-full bg-secondary border-r border-slate-700/50 flex flex-col relative z-20">
      <div className="p-6 flex items-center space-x-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary to-blue-400 flex items-center justify-center shadow-lg shadow-primary/20">
          <span className="text-white font-bold text-xl">C</span>
        </div>
        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
          CollabSphere
        </span>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto relative">
        <div className="text-xs font-semibold text-textSecondary uppercase tracking-wider mb-4 px-2">Menu</div>
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-3 py-2.5 rounded-xl transition-all duration-200 relative group ${
                isActive
                  ? 'text-primary'
                  : 'text-textSecondary hover:bg-slate-800/50 hover:text-white'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active-bg"
                    className="absolute inset-0 bg-primary/10 rounded-xl"
                    initial={false}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active-indicator"
                    className="absolute -left-4 w-1 h-8 bg-primary rounded-r-full"
                    initial={false}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
                <item.icon size={20} className={`relative z-10 ${isActive ? 'text-primary' : 'text-slate-400 group-hover:text-white transition-colors'}`} />
                <span className="font-medium relative z-10">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-700/50 space-y-1">
        <button className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-textSecondary hover:bg-slate-800/50 hover:text-white transition-colors">
          <Bell size={20} />
          <span className="font-medium">Notifications</span>
        </button>
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
              isActive ? 'text-primary bg-primary/10' : 'text-textSecondary hover:bg-slate-800/50 hover:text-white'
            }`
          }
        >
          <Settings size={20} />
          <span className="font-medium">Settings</span>
        </NavLink>
        <Link to="/profile" className="block mt-4 pt-4 border-t border-slate-700/50">
          <div className="flex items-center space-x-3 px-2 cursor-pointer group hover:bg-slate-800/50 rounded-xl p-2 transition-colors">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold shadow-md">
              JD
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate group-hover:text-primary transition-colors">John Doe</p>
              <p className="text-xs text-textSecondary truncate">Pro Plan</p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
