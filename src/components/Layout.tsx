import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const Layout = () => {
  return (
    <div className="flex h-screen bg-background overflow-hidden font-sans text-textPrimary">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-6 bg-background relative">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
