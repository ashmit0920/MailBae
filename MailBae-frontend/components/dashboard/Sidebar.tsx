'use client';

import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import {
  Mail,
  BarChart3,
  FileText,
  Lightbulb,
  Settings,
  LogOut,
  X
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const navigation = [
  { name: 'Dashboard', id: 'dashboard', icon: BarChart3 },
  { name: 'Summaries', id: 'summaries', icon: FileText },
  { name: 'Email Insights', id: 'insights', icon: Lightbulb },
  { name: 'Settings', id: 'settings', icon: Settings },
];

export default function Sidebar({ isOpen, onClose, activeSection, onSectionChange }: SidebarProps) {
  const router = useRouter();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error('Logout failed:', error.message)
    } else {
      // Optional: Redirect user to login or home page
      router.push('/login')
    }
  }


  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-75 z-20 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 flex flex-col
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Header */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center space-x-2">
            <Mail className="w-8 h-8 text-blue-500" />
            <span className="text-xl font-bold text-gray-900">MailBae</span>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 overflow-y-auto">
          <ul className="space-y-3">
            {navigation.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => {
                    onSectionChange(item.id);
                    onClose();
                  }}
                  className={`
                    w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200
                    ${activeSection === item.id
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-500'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    }
                  `}
                >
                  <item.icon className={`
                    mr-3 h-5 w-5 flex-shrink-0
                    ${activeSection === item.id ? 'text-blue-500' : 'text-gray-400'}
                  `} />
                  {item.name}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Logout button */}
        <div className="p-4 border-t border-gray-200 flex-shrink-0">
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-4 py-3 text-sm font-medium text-gray-700 rounded-xl hover:bg-gray-50 hover:text-gray-900 transition-all duration-200"
          >
            <LogOut className="mr-3 h-5 w-5 text-gray-400" />
            Log Out
          </button>
        </div>
      </div>
    </>
  );
}