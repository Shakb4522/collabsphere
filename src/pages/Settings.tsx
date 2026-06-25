import { Monitor, Moon, Sun, Globe, Lock } from 'lucide-react';

const Settings = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-textSecondary mt-1">Manage your app preferences and configurations.</p>
      </div>

      <div className="bg-secondary rounded-2xl border border-slate-700/50 overflow-hidden shadow-lg">
        <div className="p-6 border-b border-slate-700/50">
          <h3 className="text-lg font-bold text-white flex items-center">
            <Monitor className="mr-2 text-primary" size={20} />
            Appearance
          </h3>
          <p className="text-sm text-textSecondary mt-1">Customize how CollabSphere looks on your device.</p>
          
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="border-2 border-primary bg-slate-800 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer shadow-md">
              <Moon className="text-white mb-2" size={24} />
              <span className="text-sm font-medium text-white">Dark</span>
            </div>
            <div className="border border-slate-700 bg-slate-800/50 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer hover:border-slate-500 transition-colors">
              <Sun className="text-slate-400 mb-2" size={24} />
              <span className="text-sm font-medium text-slate-400">Light</span>
            </div>
            <div className="border border-slate-700 bg-slate-800/50 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer hover:border-slate-500 transition-colors">
              <Monitor className="text-slate-400 mb-2" size={24} />
              <span className="text-sm font-medium text-slate-400">System</span>
            </div>
          </div>
        </div>

        <div className="p-6 border-b border-slate-700/50">
          <h3 className="text-lg font-bold text-white flex items-center">
            <Globe className="mr-2 text-primary" size={20} />
            Language & Region
          </h3>
          <div className="mt-4 grid grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium text-textSecondary block mb-2">Language</label>
              <select className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary">
                <option>English (US)</option>
                <option>Spanish</option>
                <option>French</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-textSecondary block mb-2">Timezone</label>
              <select className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary">
                <option>Pacific Time (PT)</option>
                <option>Eastern Time (ET)</option>
                <option>Central European Time (CET)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="p-6">
          <h3 className="text-lg font-bold text-white flex items-center">
            <Lock className="mr-2 text-primary" size={20} />
            Privacy
          </h3>
          <div className="mt-4 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white">Read Receipts</p>
                <p className="text-xs text-textSecondary">Let others know when you've read their messages.</p>
              </div>
              <div className="w-11 h-6 bg-primary rounded-full relative cursor-pointer shadow-inner">
                <div className="w-4 h-4 bg-white rounded-full absolute right-1 top-1 shadow-sm"></div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white">Online Status</p>
                <p className="text-xs text-textSecondary">Show when you are active in the app.</p>
              </div>
              <div className="w-11 h-6 bg-primary rounded-full relative cursor-pointer shadow-inner">
                <div className="w-4 h-4 bg-white rounded-full absolute right-1 top-1 shadow-sm"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Settings;
