import { Search, Filter, Upload, File, FileText, Image as ImageIcon, FileArchive, MoreVertical, LayoutGrid, List } from 'lucide-react';
import { motion } from 'framer-motion';

const Files = () => {
  const files = [
    { id: 1, name: 'Project Requirements.pdf', type: 'pdf', size: '2.4 MB', owner: 'John Doe', date: '2h ago', icon: FileText, color: 'text-red-400' },
    { id: 2, name: 'Dashboard Design.fig', type: 'design', size: '15.8 MB', owner: 'Sarah Smith', date: '5h ago', icon: ImageIcon, color: 'text-purple-400' },
    { id: 3, name: 'Q3 Financial Report.xlsx', type: 'spreadsheet', size: '1.2 MB', owner: 'Mike Johnson', date: '1d ago', icon: File, color: 'text-green-400' },
    { id: 4, name: 'Assets Bundle.zip', type: 'archive', size: '128 MB', owner: 'Emily Davis', date: '2d ago', icon: FileArchive, color: 'text-yellow-400' },
    { id: 5, name: 'Meeting Notes.docx', type: 'document', size: '156 KB', owner: 'John Doe', date: '3d ago', icon: FileText, color: 'text-blue-400' },
  ];

  return (
    <div className="space-y-6 h-full flex flex-col">
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex justify-between items-end"
      >
        <div>
          <h1 className="text-2xl font-bold text-white">Files</h1>
          <p className="text-textSecondary mt-1">Manage and share your workspace files.</p>
        </div>
        <button className="bg-primary hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center space-x-2 transition-all duration-200 shadow-lg shadow-primary/20 hover:-translate-y-0.5">
          <Upload size={16} />
          <span>Upload File</span>
        </button>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex items-center justify-between bg-secondary p-4 rounded-2xl border border-slate-700/50 shadow-sm"
      >
        <div className="flex items-center space-x-4 flex-1">
          <div className="relative max-w-md w-full group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
            <input 
              type="text" 
              placeholder="Search files..." 
              className="w-full bg-slate-800/50 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
            />
          </div>
          <button className="flex items-center space-x-2 text-slate-400 hover:text-white px-3 py-2 rounded-lg hover:bg-slate-800 transition-colors">
            <Filter size={16} />
            <span className="text-sm font-medium">Filters</span>
          </button>
        </div>
        <div className="flex items-center space-x-1 border border-slate-700 rounded-lg p-1 bg-slate-800/50">
          <button className="p-1.5 bg-slate-700 text-white rounded-md shadow-sm transition-colors">
            <LayoutGrid size={16} />
          </button>
          <button className="p-1.5 text-slate-400 hover:text-white rounded-md transition-colors">
            <List size={16} />
          </button>
        </div>
      </motion.div>

      <div className="flex-1 overflow-y-auto pr-2">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {files.map((file, i) => (
            <motion.div
              key={file.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}
              className="bg-secondary rounded-2xl border border-slate-700/50 p-4 hover:border-slate-500 transition-all duration-300 group cursor-pointer hover:shadow-lg hover:-translate-y-1"
            >
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl bg-slate-800/80 ${file.color} shadow-inner`}>
                  <file.icon size={24} />
                </div>
                <button className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg opacity-0 group-hover:opacity-100 transition-all">
                  <MoreVertical size={16} />
                </button>
              </div>
              <h3 className="text-white font-medium truncate mb-1" title={file.name}>{file.name}</h3>
              <p className="text-xs text-textSecondary truncate">Added by {file.owner}</p>
              <div className="flex items-center justify-between text-xs text-textSecondary mt-4 pt-4 border-t border-slate-700/50">
                <span className="font-medium bg-slate-800 px-2 py-1 rounded-md">{file.size}</span>
                <span>{file.date}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default Files;
