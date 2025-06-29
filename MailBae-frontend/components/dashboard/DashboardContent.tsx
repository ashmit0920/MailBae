'use client';

import { Menu, Bell, Search } from 'lucide-react';
import StatCard from './StatCard';
import RecentAlerts from './RecentAlerts';
import TodaySummary from './TodaySummary';
import SummaryCards from './SummaryCards';
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Settings from './Settings';
import GmailConnectButton from './ConnectGmail'

interface DashboardContentProps {
  onMenuClick: () => void;
  activeSection: string;
  username: string;
}

interface UserMetrics {
  emails_processed: number
  summaries_generated: number
  time_saved: number
  auto_replies: number
}

export default function DashboardContent({ onMenuClick, activeSection, username }: DashboardContentProps) {
  const [metrics, setMetrics] = useState<UserMetrics | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!username) return;

    const fetchMetrics = async () => {
      const { data, error } = await supabase
        .from('dashboard_metrics')
        .select('emails_processed, time_saved, auto_replies, summaries_generated')
        .eq('username', username)
        .single();

      if (error) {
        console.error('Error fetching metrics:', error);
      } else {
        setMetrics(data);
      }

      setLoading(false);
    };

    fetchMetrics();
  }, [username]);


  if (loading) return <p className="text-center text-gray-500">Loading stats...</p>

  if (!metrics) return <p className="text-center text-red-500">No metrics found {username}</p>

  const renderContent = () => {
    switch (activeSection) {
      case 'summaries':
        return (
          <div className="bg-white rounded-2xl shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Today's Email Summary</h2>
            <SummaryCards />
          </div>
        );
      case 'insights':
        return (
          <div className="bg-white rounded-2xl shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Email Insights (Coming Soon...)</h2>
            <p className="text-gray-600">Detailed analytics and insights about your email patterns.</p>
          </div>
        );
      case 'settings':
        return (
          <div className="bg-white rounded-2xl shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Settings</h2>
            <p className="text-gray-600">Manage your account settings and preferences.</p>
            <Settings />
          </div>
        );
      default:
        return (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard
                title="Emails Processed"
                value={`${metrics.emails_processed}`}
                change="+12%"
                changeType="positive"
                icon="📧"
              />
              <StatCard
                title="Time Saved"
                value={`${metrics.time_saved}h`}
                change="+8%"
                changeType="positive"
                icon="⏰"
              />
              <StatCard
                title="Auto Replies"
                value={`${metrics.auto_replies}`}
                change="+15%"
                changeType="positive"
                icon="🤖"
              />
              <StatCard
                title="Summaries Generated"
                value={`${metrics.summaries_generated}`}
                change="0%"
                changeType="neutral"
                icon="📊"
              />
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <RecentAlerts />
              <TodaySummary />
            </div>
          </>
        );
    }
  };

  return (
    <div className="flex-1">
      {/* Top Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={onMenuClick}
                className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              >
                <Menu className="w-6 h-6" />
              </button>
              <div className="ml-4 lg:ml-0">
                <h1 className="text-2xl font-bold text-gray-900">
                  Welcome back, {username}
                </h1>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="relative hidden sm:block">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Notifications */}
              <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                <Bell className="w-6 h-6" />
              </button>

              {/* Profile */}
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">S</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        {renderContent()}
        <GmailConnectButton />
      </main>
    </div>
  );
}