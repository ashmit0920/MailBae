'use client';

import { Menu, Bell, Search } from 'lucide-react';
import StatCard from './StatCard';
import RecentAlerts from './RecentAlerts';
import TodaySummary from './TodaySummary';
import SummaryDemo from './SummaryDemo';

interface DashboardContentProps {
  onMenuClick: () => void;
  activeSection: string;
}

export default function DashboardContent({ onMenuClick, activeSection }: DashboardContentProps) {
  const renderContent = () => {
    switch (activeSection) {
      case 'summaries':
        return (
          <div className="bg-white rounded-2xl shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Email Summaries</h2>
            <p className="text-gray-600 whitespace-pre-wrap">Ashmit, your registration for the Adobe India Hackathon is initiated but pending confirmation from team members by July 10, 2025. Unstop highlights job opportunities from Mercedes-Benz, NOCAP and 30K+ employers and opportunities to win prizes. Spotify is offering 3 months of Premium for ₹59, ending soon. SPR Placement shared an invite for Flipkart GRiD 7.0 and announced that 8 students from Thapar University received Pre-Placement Offers from ZS Campus Beats 2025-26. NVIDIA is hosting a webinar on July 24, 2025, about accelerating applications on GPUs, offering a free training course for attendees. A computer vision internship at Rebec Technologies is available through VentureLab Thapar. IIC is hosting an online guest lecture on June 26, 2025, with Mr. Sunil Kumar from Bank of America, discussing innovation through agility and inclusive technology. Gurpal Singh Chhabra forwarded an invite to a June CTF Challenge focused on Reverse Engineering & Malware Analysis. CoE-Data Science and AI (CoDSaI) announced the Israeli-Indian Hackathon on Restorative Healthcare with a PPT submission deadline of July 24, 2025, and a total prize of INR 100,000, plus internship opportunities. GirlScript Foundation invites you to join “Education Outreach” as a mentor or leader.</p>
            {/* <SummaryDemo /> */}
          </div>
        );
      case 'insights':
        return (
          <div className="bg-white rounded-2xl shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Email Insights</h2>
            <p className="text-gray-600">Detailed analytics and insights about your email patterns.</p>
          </div>
        );
      case 'settings':
        return (
          <div className="bg-white rounded-2xl shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Settings</h2>
            <p className="text-gray-600">Manage your account settings and preferences.</p>
          </div>
        );
      default:
        return (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard
                title="Emails Processed"
                value="1,247"
                change="+12%"
                changeType="positive"
                icon="📧"
              />
              <StatCard
                title="Time Saved"
                value="23.5h"
                change="+8%"
                changeType="positive"
                icon="⏰"
              />
              <StatCard
                title="Auto Replies"
                value="89"
                change="+15%"
                changeType="positive"
                icon="🤖"
              />
              <StatCard
                title="Categories"
                value="12"
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
                  Welcome back, Sarah 👋
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
      </main>
    </div>
  );
}