import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Mic, MicOff, Video, Monitor, MessageSquare, Users, PenTool, PhoneOff, Settings, MoreVertical, Video as VideoIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import io from 'socket.io-client';
import Peer from 'peerjs';

const Meeting = () => {
  const { workspaceId, meetingId } = useParams();
  const navigate = useNavigate();
  const [workspaces, setWorkspaces] = useState<any[]>([]);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [peerStreams, setPeerStreams] = useState<Record<string, MediaStream>>({});

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userId = user._id;

  const [focusedId, setFocusedId] = useState<string>(userId);

  // Fetch workspaces
  useEffect(() => {
    if (!userId) {
      navigate('/login');
      return;
    }
    fetch(`http://localhost:5000/api/workspaces?userId=${userId}`)
      .then(res => res.json())
      .then(data => setWorkspaces(data))
      .catch(console.error);
  }, [userId, navigate]);

  // WebRTC & Socket Setup
  useEffect(() => {
    if (!meetingId || !userId) return;

    const socket = io('http://localhost:5000');
    // Using default PeerJS public server for easy testing
    const peer = new Peer(userId);

    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setLocalStream(stream);

        // Answer incoming calls
        peer.on('call', call => {
          call.answer(stream);
          call.on('stream', remoteStream => {
            setPeerStreams(prev => ({ ...prev, [call.peer]: remoteStream }));
          });
        });

        // Listen for new users connecting
        socket.on('user-connected', connectedUserId => {
          // Call the new user
          const call = peer.call(connectedUserId, stream);
          call.on('stream', remoteStream => {
            setPeerStreams(prev => ({ ...prev, [connectedUserId]: remoteStream }));
          });
        });

        // Listen for users disconnecting
        socket.on('user-disconnected', disconnectedUserId => {
          setPeerStreams(prev => {
            const newStreams = { ...prev };
            delete newStreams[disconnectedUserId];
            return newStreams;
          });
        });

      })
      .catch(err => {
        console.error("Error accessing media devices:", err);
        alert("Could not access your camera and microphone. Please check permissions.");
      });

    peer.on('open', id => {
      socket.emit('join-room', meetingId, id);
    });

    return () => {
      socket.disconnect();
      peer.destroy();
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [meetingId, userId]);

  // Handle Mute Audio Toggle
  useEffect(() => {
    if (localStream) {
      localStream.getAudioTracks().forEach(track => {
        track.enabled = !isMuted;
      });
    }
  }, [isMuted, localStream]);

  // Handle Video Toggle
  useEffect(() => {
    if (localStream) {
      localStream.getVideoTracks().forEach(track => {
        track.enabled = !isVideoOff;
      });
    }
  }, [isVideoOff, localStream]);

  const leaveMeeting = () => {
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
    }
    navigate(`/workspaces/${workspaceId}`);
  };

  const activeMeeting = workspaces
    .flatMap(w => w.meetings?.map((m: any) => ({ ...m, workspaceId: w._id, workspaceName: w.name, members: w.members })) || [])
    .find((m: any) => m._id === meetingId);

  // Build real participants list from the workspace members, but only show those actively connected
  const allMembers = activeMeeting?.members || [];
  const participants = allMembers
    .filter((member: any) => member._id === userId || peerStreams[member._id])
    .map((member: any) => ({
      id: member._id,
      name: member._id === userId ? (member.name ? `${member.name} (You)` : 'You') : (member.name || member.email),
      isLocal: member._id === userId,
      avatar: null
    }));

  // Ensure local user is always focused by default if available
  useEffect(() => {
    if (participants.length > 0 && !participants.find((p: any) => p.id === focusedId)) {
      setFocusedId(userId);
    }
  }, [participants, focusedId, userId]);

  const focusedParticipant = participants.find((p: any) => p.id === focusedId);
  const otherParticipants = participants.filter((p: any) => p.id !== focusedId);

  const renderVideoCard = (p: any, isFocused: boolean) => {
    const isLocal = p.isLocal;
    const stream = isLocal ? localStream : peerStreams[p.id];

    return (
      <div 
        className={`w-full h-full relative bg-slate-800 flex flex-col items-center justify-center overflow-hidden transition-all ${!isFocused && 'cursor-pointer group hover:ring-2 hover:ring-primary'}`}
        onClick={() => !isFocused && setFocusedId(p.id)}
      >
        {stream ? (
          (!isLocal || !isVideoOff) ? (
            <video 
              ref={(el) => {
                if (el && el.srcObject !== stream) {
                  el.srcObject = stream;
                }
              }} 
              autoPlay 
              playsInline 
              muted={isLocal} 
              className={`w-full h-full object-cover ${isLocal ? 'transform -scale-x-100' : ''}`} 
            />
          ) : (
            <div className={`rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center font-bold text-white shadow-lg ${isFocused ? 'w-32 h-32 text-5xl' : 'w-16 h-16 text-xl group-hover:scale-110 transition-transform'}`}>
              {p.name ? p.name.substring(0, 2).toUpperCase() : 'U'}
            </div>
          )
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-slate-800">
             <div className={`rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center font-bold text-white shadow-lg mb-4 ${isFocused ? 'w-32 h-32 text-5xl' : 'w-16 h-16 text-xl group-hover:scale-110 transition-transform'}`}>
                {p.name ? p.name.substring(0, 2).toUpperCase() : 'U'}
             </div>
             {isFocused && <p className="text-slate-500 text-sm animate-pulse">Waiting for video...</p>}
          </div>
        )}
        
        <div className="absolute bottom-4 left-4 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-700/50 flex items-center">
          {p.isLocal && isMuted ? (
            <MicOff size={14} className="text-error mr-2" />
          ) : (
            <div className={`w-2 h-2 rounded-full mr-2 ${stream ? 'bg-green-500 animate-pulse' : 'bg-slate-500'}`}></div>
          )}
          <span className="text-white text-sm font-medium">{p.name}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-background -mx-6 -my-6">
      {/* Sidebar for Meetings */}
      <div className="w-64 border-r border-slate-700/50 bg-secondary flex flex-col z-20 relative">
        <div className="p-4 border-b border-slate-700/50 text-white font-bold flex items-center">
          <VideoIcon size={20} className="mr-2 text-blue-400" />
          Meetings
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-4">
          {workspaces.map(ws => (
            <div key={ws._id}>
              <div className="px-2 pb-1 text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
                <span>{ws.name}</span>
              </div>
              <div className="space-y-0.5">
                {ws.meetings?.map((m: any) => (
                  <button
                    key={m._id}
                    onClick={() => navigate(`/meeting/${ws._id}/${m._id}`)}
                    className={`w-full flex items-center justify-between px-2 py-2 rounded-lg text-sm transition-colors ${
                      meetingId === m._id 
                        ? 'bg-blue-500/20 text-blue-400 font-medium' 
                        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center text-left">
                      <span className="truncate">{m.name}</span>
                    </div>
                    {m.isLive && (
                      <span className="w-2 h-2 rounded-full bg-error animate-pulse flex-shrink-0 ml-2"></span>
                    )}
                  </button>
                ))}
                {(!ws.meetings || ws.meetings.length === 0) && (
                  <div className="px-2 py-1 text-xs text-slate-500">No meetings</div>
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

      {/* Main Meeting Area */}
      <div className="flex-1 flex flex-col bg-slate-900 relative">
        {activeMeeting ? (
          <>
            {/* Header */}
            <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-10 bg-gradient-to-b from-slate-900/80 to-transparent">
              <div className="flex items-center space-x-3">
                <div className="bg-slate-800/80 backdrop-blur-md px-4 py-2 rounded-xl border border-slate-700/50">
                  <h2 className="text-white font-medium">{activeMeeting.name}</h2>
                  <p className="text-xs text-slate-400">{activeMeeting.workspaceName}</p>
                </div>
                {activeMeeting.isLive && (
                  <div className="bg-error/20 backdrop-blur-md px-3 py-1.5 rounded-lg border border-error/30 flex items-center">
                    <span className="w-2 h-2 rounded-full bg-error animate-pulse mr-2"></span>
                    <span className="text-error text-xs font-bold tracking-wide">LIVE</span>
                  </div>
                )}
              </div>
              <div className="flex space-x-2">
                <button className="p-2 bg-slate-800/80 backdrop-blur-md hover:bg-slate-700 rounded-lg text-slate-300 transition-colors border border-slate-700/50">
                  <Users size={20} />
                </button>
                <button className="p-2 bg-slate-800/80 backdrop-blur-md hover:bg-slate-700 rounded-lg text-slate-300 transition-colors border border-slate-700/50">
                  <MessageSquare size={20} />
                </button>
              </div>
            </div>

            {/* Dynamic Discord-like Layout */}
            <div className="flex-1 p-6 pt-20 pb-28 flex gap-4 w-full h-full max-w-[1400px] mx-auto overflow-hidden">
              
              {/* Focused Main Video */}
              <AnimatePresence mode="wait">
                <motion.div 
                  key={focusedId}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                  className="flex-1 bg-black rounded-2xl border border-slate-700/50 shadow-2xl overflow-hidden relative"
                >
                  {focusedParticipant && renderVideoCard(focusedParticipant, true)}
                </motion.div>
              </AnimatePresence>

              {/* Sidebar Cadres (Other Participants) */}
              <div className="w-64 flex flex-col gap-4 overflow-y-auto custom-scrollbar pr-2">
                {otherParticipants.map((p, i) => (
                  <motion.div 
                    key={p.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="h-36 rounded-xl overflow-hidden shadow-lg border border-slate-700/50 shrink-0"
                  >
                    {renderVideoCard(p, false)}
                  </motion.div>
                ))}
              </div>

            </div>

            {/* Controls Bar */}
            <motion.div initial={{ y: 100 }} animate={{ y: 0 }} className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-slate-800/90 backdrop-blur-xl px-6 py-4 rounded-2xl border border-slate-700/50 flex items-center space-x-6 shadow-2xl z-20">
              <div className="flex items-center space-x-3">
                <button onClick={() => setIsMuted(!isMuted)} className={`p-4 rounded-full flex items-center justify-center transition-all ${isMuted ? 'bg-error/20 text-error hover:bg-error/30' : 'bg-slate-700 text-white hover:bg-slate-600'}`}>
                  {isMuted ? <MicOff size={24} /> : <Mic size={24} />}
                </button>
                <button onClick={() => setIsVideoOff(!isVideoOff)} className={`p-4 rounded-full flex items-center justify-center transition-all ${isVideoOff ? 'bg-error/20 text-error hover:bg-error/30' : 'bg-slate-700 text-white hover:bg-slate-600'}`}>
                  <Video size={24} />
                </button>
              </div>
              <div className="w-px h-10 bg-slate-700"></div>
              <div className="flex items-center space-x-3">
                <button className="p-3 rounded-full bg-slate-700 text-white hover:bg-slate-600 transition-all">
                  <Monitor size={20} />
                </button>
                <button className="p-3 rounded-full bg-slate-700 text-white hover:bg-slate-600 transition-all">
                  <PenTool size={20} />
                </button>
                <button className="p-3 rounded-full bg-slate-700 text-white hover:bg-slate-600 transition-all">
                  <MoreVertical size={20} />
                </button>
              </div>
              <div className="w-px h-10 bg-slate-700"></div>
              <button onClick={leaveMeeting} className="px-6 py-3 rounded-full bg-error hover:bg-red-600 text-white font-medium flex items-center shadow-lg shadow-error/20 transition-all">
                <PhoneOff size={20} className="mr-2" />
                Leave
              </button>
            </motion.div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-500">
            <VideoIcon size={64} className="mb-4 opacity-50" />
            <h3 className="text-xl font-bold text-white mb-2">No Meeting Selected</h3>
            <p className="max-w-md text-center">Select a meeting from the sidebar to join the video room.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Meeting;
