import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Send, Hash, Search, Phone, Video, MoreVertical, Plus, Smile, Paperclip, Image as ImageIcon, FolderOpen } from 'lucide-react';
import { motion } from 'framer-motion';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const Chat = () => {
  const { workspaceId, channelId } = useParams();
  const navigate = useNavigate();
  const [workspaces, setWorkspaces] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userId = user._id;

  useEffect(() => {
    if (!userId) {
      navigate('/login');
      return;
    }
    fetch(`${API_URL}/api/workspaces?userId=${userId}`)
      .then(res => res.json())
      .then(data => setWorkspaces(data))
      .catch(console.error);
  }, [userId, navigate]);

  useEffect(() => {
    if (channelId) {
      fetch(`${API_URL}/api/messages/${channelId}`)
        .then(res => res.json())
        .then(data => setMessages(data))
        .catch(console.error);
    } else {
      setMessages([]);
    }
  }, [channelId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !channelId || !workspaceId) return;

    try {
      const res = await fetch(`${API_URL}/api/messages/${channelId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ workspaceId, userId, content: newMessage })
      });
      if (res.ok) {
        const msg = await res.json();
        setMessages([...messages, msg]);
        setNewMessage('');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const activeChannel = workspaces
    .flatMap(w => w.channels?.map((c: any) => ({ ...c, workspaceId: w._id, workspaceName: w.name })) || [])
    .find((c: any) => c._id === channelId);

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-background -mx-6 -my-6">
      {/* Channels Sidebar */}
      <div className="w-64 border-r border-slate-700/50 bg-secondary flex flex-col">
        <div className="p-4 border-b border-slate-700/50">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search channels..." 
              className="w-full bg-slate-800/50 border border-slate-700 rounded-lg pl-9 pr-4 py-1.5 text-sm text-white focus:outline-none focus:border-primary transition-colors"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-4">
          {workspaces.map(ws => (
            <div key={ws._id}>
              <div className="px-2 pb-1 text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
                <span>{ws.name}</span>
              </div>
              <div className="space-y-0.5">
                {ws.channels?.map((c: any) => (
                  <button
                    key={c._id}
                    onClick={() => navigate(`/chat/${ws._id}/${c._id}`)}
                    className={`w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-sm transition-colors ${
                      channelId === c._id 
                        ? 'bg-primary/10 text-primary font-medium' 
                        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center">
                      <Hash size={16} className={`mr-2 ${channelId === c._id ? 'text-primary' : 'text-slate-500'}`} />
                      {c.name}
                    </div>
                  </button>
                ))}
                {(!ws.channels || ws.channels.length === 0) && (
                  <div className="px-2 py-1 text-xs text-slate-500">No channels</div>
                )}
              </div>
            </div>
          ))}
          {workspaces.length === 0 && (
            <div className="p-4 text-center text-slate-500 text-sm">
              You are not in any workspaces.
            </div>
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-background">
        {activeChannel ? (
          <>
            {/* Chat Header */}
            <div className="h-14 border-b border-slate-700/50 flex items-center justify-between px-6 bg-secondary/50 backdrop-blur-sm z-10">
              <div className="flex items-center">
                <Hash size={20} className="text-slate-400 mr-2" />
                <h2 className="font-bold text-white">{activeChannel.name}</h2>
                <span className="mx-3 text-slate-700">|</span>
                <span className="text-sm text-slate-400">{activeChannel.workspaceName}</span>
              </div>
              <div className="flex items-center space-x-4">
                <button className="text-slate-400 hover:text-white transition-colors"><Phone size={18} /></button>
                <button className="text-slate-400 hover:text-white transition-colors"><Video size={18} /></button>
                <button className="text-slate-400 hover:text-white transition-colors"><Search size={18} /></button>
                <button className="text-slate-400 hover:text-white transition-colors"><MoreVertical size={18} /></button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
              {messages.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-4">
                  <Hash size={48} className="text-slate-700" />
                  <p>This is the start of the <strong>#{activeChannel.name}</strong> channel.</p>
                </div>
              )}
              {messages.map((msg, i) => {
                const isCurrentUser = msg.user._id === userId;
                return (
                  <motion.div 
                    key={msg._id || i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`flex max-w-[70%] ${isCurrentUser ? 'flex-row-reverse' : 'flex-row'}`}>
                      <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-white font-bold text-xs ${isCurrentUser ? 'ml-3 bg-primary' : 'mr-3 bg-purple-500'}`}>
                        {msg.user?.name ? msg.user.name.substring(0, 2).toUpperCase() : 'U'}
                      </div>
                      <div>
                        {!isCurrentUser && (
                          <div className="flex items-baseline space-x-2 mb-1">
                            <span className="font-medium text-sm text-slate-300">{msg.user?.name}</span>
                            <span className="text-xs text-slate-500">{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                        )}
                        <div className={`px-4 py-2 rounded-2xl ${isCurrentUser ? 'bg-primary text-white rounded-tr-none' : 'bg-slate-800 border border-slate-700 text-slate-200 rounded-tl-none'}`}>
                          <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-4 bg-secondary border-t border-slate-700/50">
              <form onSubmit={handleSendMessage} className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden focus-within:ring-1 focus-within:ring-primary focus-within:border-primary transition-all">
                <div className="px-4 py-3">
                  <textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder={`Message #${activeChannel.name}`}
                    className="w-full bg-transparent text-white placeholder-slate-400 focus:outline-none resize-none"
                    rows={1}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage(e);
                      }
                    }}
                  />
                </div>
                <div className="px-3 py-2 bg-slate-800/80 border-t border-slate-700/50 flex justify-between items-center">
                  <div className="flex space-x-1">
                    <button type="button" className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"><Plus size={18} /></button>
                    <button type="button" className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"><ImageIcon size={18} /></button>
                    <button type="button" className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"><Paperclip size={18} /></button>
                    <button type="button" className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"><Smile size={18} /></button>
                  </div>
                  <button 
                    type="submit"
                    disabled={!newMessage.trim()}
                    className="p-1.5 bg-primary text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors"
                  >
                    <Send size={18} className="ml-0.5" />
                  </button>
                </div>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-500">
            <FolderOpen size={64} className="mb-4 opacity-50" />
            <h3 className="text-xl font-bold text-white mb-2">No Channel Selected</h3>
            <p className="max-w-md text-center">Please select a channel from the sidebar to start collaborating with your team.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
