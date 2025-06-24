'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/dashboard/Sidebar';
import DashboardContent from '@/components/dashboard/DashboardContent';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function WelcomePage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  // protect the route by checking authentication
  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()

      if (!session) {
        router.push('/login')
      } else {
        const { data: { user } } = await supabase.auth.getUser()
        setUser(user)
        setLoading(false)
      }
    }

    getUser()
  }, [router])

  if (loading) {
    return <p className="text-center mt-10 text-gray-500">Loading...</p>
  }

  const username = user?.user_metadata?.username

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />

      <div className="flex-1 flex flex-col lg:ml-0">
        <DashboardContent
          onMenuClick={() => setSidebarOpen(true)}
          activeSection={activeSection}
          username={username}
        />
      </div>
    </div>
  );
}