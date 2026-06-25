import { User, Mail, Shield, Bell, Camera } from 'lucide-react';

const Profile = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-secondary rounded-2xl border border-slate-700/50 overflow-hidden shadow-lg">
        <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-600 relative">
          <div className="absolute -bottom-12 left-8">
            <div className="relative group">
              <div className="w-24 h-24 rounded-full border-4 border-secondary bg-slate-800 flex items-center justify-center text-3xl font-bold text-white shadow-xl">
                JD
              </div>
              <button className="absolute bottom-0 right-0 p-1.5 bg-primary text-white rounded-full border-2 border-secondary opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera size={14} />
              </button>
            </div>
          </div>
        </div>
        <div className="pt-16 pb-8 px-8">
          <h2 className="text-2xl font-bold text-white">John Doe</h2>
          <p className="text-primary font-medium mt-1">Senior Product Designer</p>
          <p className="text-textSecondary mt-2 max-w-2xl">
            Passionate about creating intuitive user experiences. Based in San Francisco. Loves coffee and clean code.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-2">
          <button className="w-full flex items-center space-x-3 px-4 py-3 bg-primary/10 text-primary rounded-xl font-medium transition-colors">
            <User size={18} />
            <span>Personal Info</span>
          </button>
          <button className="w-full flex items-center space-x-3 px-4 py-3 text-textSecondary hover:bg-slate-800/50 hover:text-white rounded-xl font-medium transition-colors">
            <Shield size={18} />
            <span>Security</span>
          </button>
          <button className="w-full flex items-center space-x-3 px-4 py-3 text-textSecondary hover:bg-slate-800/50 hover:text-white rounded-xl font-medium transition-colors">
            <Bell size={18} />
            <span>Notifications</span>
          </button>
        </div>

        <div className="md:col-span-2 bg-secondary rounded-2xl border border-slate-700/50 p-6 space-y-6 shadow-lg">
          <h3 className="text-lg font-bold text-white mb-4">Personal Information</h3>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-sm font-medium text-textSecondary">First Name</label>
              <input type="text" defaultValue="John" className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary transition-colors" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-textSecondary">Last Name</label>
              <input type="text" defaultValue="Doe" className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary transition-colors" />
            </div>
            <div className="col-span-2 space-y-1">
              <label className="text-sm font-medium text-textSecondary">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input type="email" defaultValue="john.doe@example.com" className="w-full bg-slate-800/50 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:border-primary transition-colors" />
              </div>
            </div>
          </div>
          <div className="pt-4 flex justify-end">
            <button className="bg-primary hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium transition-colors shadow-lg shadow-primary/20">
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Profile;
