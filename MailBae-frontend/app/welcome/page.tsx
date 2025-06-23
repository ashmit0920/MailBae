'use client';

import { useState } from 'react';
import Sidebar from '@/components/dashboard/Sidebar';
import DashboardContent from '@/components/dashboard/DashboardContent';

export default function WelcomePage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar 
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />
      
      <div className="lg:pl-64">
        <DashboardContent 
          onMenuClick={() => setSidebarOpen(true)}
          activeSection={activeSection}
        />
      </div>
    </div>
  );
}