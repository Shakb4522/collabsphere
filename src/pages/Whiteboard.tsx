import { MousePointer2, PenTool, Square, Circle, ArrowRight, Type, StickyNote, Eraser, Undo2, Redo2, Download, Share2 } from 'lucide-react';

const Whiteboard = () => {
  const tools = [
    { icon: MousePointer2, label: 'Select' },
    { icon: PenTool, label: 'Pen', active: true },
    { icon: Square, label: 'Rectangle' },
    { icon: Circle, label: 'Circle' },
    { icon: ArrowRight, label: 'Arrow' },
    { icon: Type, label: 'Text' },
    { icon: StickyNote, label: 'Sticky Note' },
    { icon: Eraser, label: 'Eraser' },
  ];

  return (
    <div className="h-full flex flex-col bg-slate-900 rounded-2xl border border-slate-700/50 overflow-hidden relative shadow-2xl">
      <div className="absolute top-4 left-6 right-6 flex justify-between items-center z-10 pointer-events-none">
        <div className="bg-background/80 backdrop-blur-md px-4 py-2 rounded-xl border border-slate-700/50 pointer-events-auto shadow-lg">
          <span className="text-white font-medium">Architecture Diagram</span>
          <span className="text-slate-400 text-sm ml-2 px-2 border-l border-slate-600">Saved</span>
        </div>
        
        <div className="flex space-x-3 pointer-events-auto">
          <div className="flex items-center -space-x-2 mr-4">
            <div className="w-8 h-8 rounded-full border-2 border-background bg-purple-500 z-30" />
            <div className="w-8 h-8 rounded-full border-2 border-background bg-blue-500 z-20" />
            <div className="w-8 h-8 rounded-full border-2 border-background bg-green-500 z-10" />
            <div className="w-8 h-8 rounded-full border-2 border-background bg-slate-700 flex items-center justify-center text-xs font-medium text-white z-0">
              +3
            </div>
          </div>
          <button className="p-2 bg-background/80 backdrop-blur-md rounded-lg text-white border border-slate-700/50 hover:bg-slate-800 transition-colors shadow-lg">
            <Share2 size={20} />
          </button>
          <button className="p-2 bg-background/80 backdrop-blur-md rounded-lg text-white border border-slate-700/50 hover:bg-slate-800 transition-colors shadow-lg">
            <Download size={20} />
          </button>
        </div>
      </div>

      <div className="absolute left-6 top-1/2 -translate-y-1/2 flex flex-col space-y-2 bg-background/80 backdrop-blur-md p-2 rounded-xl border border-slate-700/50 z-10 shadow-xl">
        {tools.map((t) => (
          <button 
            key={t.label} 
            className={`p-2 rounded-lg transition-colors ${t.active ? 'bg-primary text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
            title={t.label}
          >
            <t.icon size={20} />
          </button>
        ))}
      </div>

      <div className="absolute bottom-6 left-6 flex space-x-2 bg-background/80 backdrop-blur-md p-2 rounded-xl border border-slate-700/50 z-10 shadow-xl">
        <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
          <Undo2 size={20} />
        </button>
        <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
          <Redo2 size={20} />
        </button>
      </div>

      <div className="flex-1 w-full h-full relative cursor-crosshair overflow-hidden">
        <svg className="w-full h-full opacity-20 pointer-events-none absolute inset-0" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>

        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-64 h-32 border-2 border-primary rounded-xl bg-secondary flex items-center justify-center shadow-lg transform -rotate-2 cursor-move hover:border-blue-400 transition-colors">
            <span className="text-white font-medium text-lg">Frontend Service</span>
          </div>
          <div className="absolute top-1/4 right-1/3 w-64 h-32 border-2 border-green-500 rounded-xl bg-secondary flex items-center justify-center shadow-lg transform rotate-1 cursor-move hover:border-green-400 transition-colors">
            <span className="text-white font-medium text-lg">Auth API</span>
          </div>
          
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
            <path d="M 450 300 C 550 300, 650 300, 750 300" fill="none" stroke="#3B82F6" strokeWidth="3" strokeDasharray="5,5" markerEnd="url(#arrowhead)" />
            <defs>
              <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="#3B82F6" />
              </marker>
            </defs>
          </svg>
        </div>
      </div>
    </div>
  );
};
export default Whiteboard;
