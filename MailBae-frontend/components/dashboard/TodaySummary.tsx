import { Calendar, Mail, TrendingUp } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useEffect, useState } from 'react'

export default function TodaySummary() {
  const [timezone, setTimezone] = useState("");
  const [since_hour, setHour] = useState(9);
  const [num_emails, setNumEmails] = useState();

  useEffect(() => {

    const fetchEmailsSinceMorning = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user) {
        console.error("User not found:", error);
        return;
      }

      const timezone = user.user_metadata?.timezone;
      const since_hour = user.user_metadata?.since_hour ?? 9;

      setTimezone(timezone)
      setHour(since_hour)

      const res = await fetch(
        `http://localhost:8000/api/no_of_emails?user_email=${user.email}&timezone=${timezone}&since_hour=${since_hour}`
      );

      const data = await res.json();
      setNumEmails(data.emails_received);
    };

    fetchEmailsSinceMorning();
  });

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Today's Summary</h3>
        <Calendar className="w-5 h-5 text-gray-400" />
      </div>

      <p className="text-sm font-medium text-gray-900 mb-4">Your Timezone: <span className='text-green-600 font-semibold'>{timezone}</span></p>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl">
          <div className="flex items-center space-x-3">
            <Mail className="w-5 h-5 text-blue-500" />
            <div>
              <p className="text-sm font-medium text-gray-900">Emails Received</p>
              <p className="text-xs text-gray-500">Since {since_hour}:00</p>
            </div>
          </div>
          <span className="text-2xl font-bold text-blue-600">{num_emails}</span>
        </div>

        <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl">
          <div className="flex items-center space-x-3">
            <TrendingUp className="w-5 h-5 text-green-500" />
            <div>
              <p className="text-sm font-medium text-gray-900">Auto Replies Sent</p>
              <p className="text-xs text-gray-500">Automated responses</p>
            </div>
          </div>
          <span className="text-2xl font-bold text-green-600">8</span>
        </div>

        <div className="p-4 bg-gray-50 rounded-xl">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Top Categories</h4>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Work</span>
              <span className="font-medium">12 emails</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Personal</span>
              <span className="font-medium">7 emails</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Newsletters</span>
              <span className="font-medium">4 emails</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}