import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Chat from './pages/Chat';
import Meeting from './pages/Meeting';
import Whiteboard from './pages/Whiteboard';
import Files from './pages/Files';
import Workspaces from './pages/Workspaces';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import WorkspaceDetails from './pages/WorkspaceDetails';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="chat" element={<Chat />} />
          <Route path="chat/:workspaceId/:channelId" element={<Chat />} />
          <Route path="meeting" element={<Meeting />} />
          <Route path="meeting/:workspaceId/:meetingId" element={<Meeting />} />
          <Route path="whiteboard" element={<Whiteboard />} />
          <Route path="files" element={<Files />} />
          <Route path="workspaces" element={<Workspaces />} />
          <Route path="workspaces/:id" element={<WorkspaceDetails />} />
          <Route path="profile" element={<Profile />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
