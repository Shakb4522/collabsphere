import { Users, Video, MessageSquare, Activity } from 'lucide-react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Mon', messages: 4000, meetings: 24 },
  { name: 'Tue', messages: 3000, meetings: 13 },
  { name: 'Wed', messages: 2000, meetings: 98 },
  { name: 'Thu', messages: 2780, meetings: 39 },
  { name: 'Fri', messages: 1890, meetings: 48 },
  { name: 'Sat', messages: 2390, meetings: 38 },
  { name: 'Sun', messages: 3490, meetings: 43 },
];

const StatCard = ({ title, value, icon: Icon, trend, delay }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.4 }}
    className="bg-secondary p-6 rounded-2xl border border-slate-700/50 shadow-sm relative overflow-hidden group hover:border-slate-600 transition-colors"
  >
    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    <div className="flex justify-between items-start relative z-10">
      <div>
        <p className="text-sm font-medium text-textSecondary">{title}</p>
        <h3 className="text-3xl font-bold text-white mt-2">{value}</h3>
        <p className={`text-xs mt-2 ${trend >= 0 ? 'text-success' : 'text-error'} flex items-center`}>
          {trend >= 0 ? '+' : ''}{trend}% from last week
        </p>
      </div>
      <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center border border-slate-700 group-hover:scale-110 transition-transform duration-300">
        <Icon className="text-primary" size={24} />
      </div>
    </div>
  </motion.div>
);

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex justify-between items-end"
      >
        <div>
          <h1 className="text-2xl font-bold text-white">Welcome back, John</h1>
          <p className="text-textSecondary mt-1">Here is what's happening in your workspaces today.</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Members" value="1,248" icon={Users} trend={12} delay={0.1} />
        <StatCard title="Active Users" value="842" icon={Activity} trend={5.4} delay={0.2} />
        <StatCard title="Meetings Today" value="34" icon={Video} trend={-2.4} delay={0.3} />
        <StatCard title="Messages Sent" value="12.4k" icon={MessageSquare} trend={14} delay={0.4} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="lg:col-span-2 bg-secondary p-6 rounded-2xl border border-slate-700/50"
        >
          <h3 className="text-lg font-semibold text-white mb-6">Team Activity</h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorMessages" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value / 1000}k`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1E293B', borderColor: '#334155', borderRadius: '0.5rem', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ color: '#F8FAFC' }}
                />
                <Area type="monotone" dataKey="messages" stroke="#3B82F6" strokeWidth={2} fillOpacity={1} fill="url(#colorMessages)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.4 }}
          className="bg-secondary p-6 rounded-2xl border border-slate-700/50 flex flex-col"
        >
          <h3 className="text-lg font-semibold text-white mb-6">Recent Activity</h3>
          <div className="flex-1 overflow-y-auto space-y-4 pr-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-start space-x-3 p-3 hover:bg-slate-800/50 rounded-xl transition-colors cursor-pointer group">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex-shrink-0 flex items-center justify-center text-white font-medium text-sm shadow-md group-hover:scale-105 transition-transform">
                  US
                </div>
                <div>
                  <p className="text-sm text-white font-medium group-hover:text-primary transition-colors">User started a meeting</p>
                  <p className="text-xs text-textSecondary mt-0.5">Project Alpha • 2m ago</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
