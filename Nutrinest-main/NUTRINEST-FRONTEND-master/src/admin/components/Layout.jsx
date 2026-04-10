import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { AuthProvider } from '../context/AuthContext';


const AdminLayoutContent = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="admin-root d-flex" style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
        onToggleSidebar={() => setSidebarOpen(s => !s)} 
        isCollapsed={sidebarCollapsed} 
        onToggleCollapsed={() => setSidebarCollapsed(s => !s)} 
      />
      <div className="flex-grow-1 d-flex flex-column" style={{ 
          marginLeft: sidebarCollapsed ? '70px' : '0', 
          transition: 'margin-left 0.3s ease',
          width: '100%'
      }}>
        <Topbar onToggleSidebar={() => setSidebarOpen(s => !s)} />
        <main className="p-4 flex-grow-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default function AdminLayout() {
  return (
    <AuthProvider>
      <AdminLayoutContent />
    </AuthProvider>
  );
}
